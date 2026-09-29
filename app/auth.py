"""Authentication and authorization dependencies.

Neon Auth is the only external identity provider accepted by this module.  All
protected routes use :func:`get_current_user`; keeping verification and user
provisioning here prevents individual route handlers from making auth
decisions differently.
"""

import base64
import json
import time
from datetime import datetime
from functools import lru_cache
from urllib.request import urlopen

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from jose import JWTError, jwt
from .config import settings
from .database import get_db
from .models import User

pwd_context = CryptContext(
    schemes=["bcrypt"], bcrypt__rounds=settings.bcrypt_rounds, deprecated="auto"
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/session")
optional_oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/session", auto_error=False
)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str | None):
    return bool(hashed) and pwd_context.verify(password, hashed)


def neon_email_is_verified(claims: dict | None) -> bool:
    if not claims:
        return False
    value = claims.get("emailVerified", claims.get("email_verified"))
    return value is True


@lru_cache(maxsize=1)
def _neon_keys(url: str):
    with urlopen(url, timeout=5) as response:
        payload = json.load(response)
    keys = payload.get("keys")
    if not isinstance(keys, list):
        raise ValueError("JWKS response does not contain a key list")
    return keys


def _b64decode(value: str) -> bytes:
    return base64.urlsafe_b64decode(value + "=" * (-len(value) % 4))


def decode_ed25519_claims(token: str, claims: dict, key_data: dict):
    """Verify an Ed25519 JWT and its time claims.

    ``claims`` are read only after the signature has been checked.  Requiring
    ``exp`` avoids accepting indefinitely valid bearer tokens.
    """
    if not isinstance(claims, dict) or not isinstance(key_data, dict):
        return None
    segments = token.split(".")
    if len(segments) != 3:
        return None
    if not isinstance(claims.get("exp"), (int, float)) or isinstance(
        claims.get("exp"), bool
    ):
        return None
    try:
        signing_input = f"{segments[0]}.{segments[1]}".encode("ascii")
        signature = _b64decode(segments[2])
        public_key = Ed25519PublicKey.from_public_bytes(_b64decode(key_data["x"]))
        public_key.verify(signature, signing_input)
        now = time.time()
        if now >= float(claims["exp"]):
            return None
        if "nbf" in claims and (
            not isinstance(claims["nbf"], (int, float))
            or isinstance(claims["nbf"], bool)
            or now < float(claims["nbf"])
        ):
            return None
    except (InvalidSignature, KeyError, TypeError, ValueError, AttributeError):
        return None
    return claims


def decode_neon_claims(token: str):
    """Return verified Neon claims, or ``None`` without exposing token data."""
    if not settings.neon_auth_jwks_url:
        return None
    try:
        header = jwt.get_unverified_header(token)
        claims = jwt.get_unverified_claims(token)
        if header.get("alg") != "EdDSA":
            return None
        if not settings.neon_auth_issuer or claims.get("iss") != settings.neon_auth_issuer:
            return None
        if settings.neon_auth_audience:
            audience = claims.get("aud")
            if (
                audience != settings.neon_auth_audience
                and not (
                    isinstance(audience, list)
                    and settings.neon_auth_audience in audience
                )
            ):
                return None
        key_data = next(
            (key for key in _neon_keys(settings.neon_auth_jwks_url)
             if isinstance(key, dict) and key.get("kid") == header.get("kid")),
            None,
        )
        if not key_data or key_data.get("kty") != "OKP" or key_data.get("crv") != "Ed25519":
            return None
        verified_claims = decode_ed25519_claims(token, claims, key_data)
        return verified_claims
    except (JWTError, OSError, TypeError, ValueError, KeyError, AttributeError):
        return None


def _sync_user(db: Session, claims: dict) -> User | None:
    subject = claims.get("sub")
    email = claims.get("email")
    if not isinstance(subject, str) or not subject or not isinstance(email, str) or not email:
        return None
    email = email.strip().lower()
    verified = neon_email_is_verified(claims)
    user = db.query(User).filter(User.neon_auth_user_id == subject).one_or_none()
    if user is None:
        user = db.query(User).filter(User.email == email).one_or_none()
        if user is not None and user.neon_auth_user_id not in (None, subject):
            return None
    if user is None:
        metadata = claims.get("user_metadata")
        name = claims.get("name")
        if not isinstance(name, str) and isinstance(metadata, dict):
            name = metadata.get("name")
        user = User(
            name=name if isinstance(name, str) and name.strip() else email.split("@")[0],
            email=email,
            neon_auth_user_id=subject,
            password_hash=None,
        )
        db.add(user)
    else:
        user.neon_auth_user_id = subject
        user.email = email
    user.email_verified = verified
    visitor_expired = bool(
        user.visitor_access_only
        and (
            user.visitor_activated_at is None
            or user.visitor_expires_at is None
            or datetime.utcnow() >= user.visitor_expires_at
        )
    )
    user.is_active = verified and not visitor_expired
    try:
        db.commit()
        db.refresh(user)
    except Exception:
        db.rollback()
        return None
    return user


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    """Canonical bearer-token verification, identity sync, and authorization."""
    claims = decode_neon_claims(token)
    user = _sync_user(db, claims) if claims else None
    if user is None or not user.is_active or not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email verification is required before accessing this account",
        )
    return user


def get_optional_user(
    token: str | None = Depends(optional_oauth2_scheme),
    db: Session = Depends(get_db),
):
    if not token:
        return None
    claims = decode_neon_claims(token)
    if not claims or not neon_email_is_verified(claims):
        return None
    user = _sync_user(db, claims)
    if user and user.visitor_access_only and (
        user.visitor_activated_at is None
        or user.visitor_expires_at is None
        or datetime.utcnow() >= user.visitor_expires_at
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="The visitor pass session has expired",
        )
    return user if user and user.is_active else None


def require_roles(*roles: str):
    allowed = set(roles)

    def dependency(user: User = Depends(get_current_user)):
        if user.role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return user

    return dependency


require_admin = require_roles("staff", "hr", "admin", "super_admin")
