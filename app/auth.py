from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from jose import jwk
import logging
import json
import base64
import time
from urllib.request import urlopen
from functools import lru_cache
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
from .config import settings
from .database import get_db
from .models import User

logger = logging.getLogger(__name__)
pwd_context = CryptContext(schemes=['bcrypt'], bcrypt__rounds=settings.bcrypt_rounds, deprecated='auto')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/session')
optional_oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/session', auto_error=False)
def hash_password(password: str): return pwd_context.hash(password)
def verify_password(password: str, hashed: str | None):
    return bool(hashed) and pwd_context.verify(password, hashed)

def neon_email_is_verified(claims: dict | None) -> bool:
    if not claims:
        return False
    if 'emailVerified' in claims:
        return claims['emailVerified'] is True
    return claims.get('email_verified') is True

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    neon_claims = None
    if settings.neon_auth_jwks_url:
        neon_claims = decode_neon_claims(token)
    verification_value = None
    verification_type = None
    verification_key = None
    if neon_claims:
        verification_key = 'emailVerified' if 'emailVerified' in neon_claims else (
            'email_verified' if 'email_verified' in neon_claims else None
        )
        if verification_key:
            verification_value = neon_claims.get(verification_key)
            verification_type = type(verification_value).__name__
    email = (neon_claims or {}).get('email') or (neon_claims or {}).get('sub')
    neon_user_id = (neon_claims or {}).get('sub') if neon_claims else None
    user = db.query(User).filter(User.neon_auth_user_id == neon_user_id).first() if neon_user_id else None
    if not user and email:
        user = db.query(User).filter(User.email == email.lower()).first()
        if user and neon_user_id and not user.neon_auth_user_id:
            user.neon_auth_user_id = neon_user_id
            db.commit()
    neon_email_verified = neon_email_is_verified(neon_claims)
    if user and neon_email_verified and not user.is_active:
        user.is_active = True
        user.email_verified = True
        db.commit()
    if not user and email and settings.neon_auth_jwks_url:
        claims = neon_claims or {}
        email_verified = neon_email_is_verified(claims)
        user = User(
            name=(claims or {}).get('name') or (claims or {}).get('user_metadata', {}).get('name') or email.split('@')[0],
            email=email.lower(),
            neon_auth_user_id=neon_user_id,
            email_verified=email_verified,
            is_active=email_verified,
            password_hash=None,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    rejected = not user or not user.is_active or (neon_claims is not None and not neon_email_verified)
    logger.warning(
        'neon_auth_check keys=%s verification_key=%s verification_type=%s '
        'verification_value=%s claims_decoded=%s user_found=%s user_active=%s rejected=%s',
        sorted(neon_claims.keys()) if neon_claims else [],
        verification_key,
        verification_type,
        verification_value,
        bool(neon_claims),
        bool(user),
        user.is_active if user else None,
        rejected,
    )
    if rejected:
        raise HTTPException(status_code=401, detail='Email verification is required before accessing this account')
    return user
def get_optional_user(token: str | None = Depends(optional_oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        return None
    claims = decode_neon_claims(token) if settings.neon_auth_jwks_url else None
    email = (claims or {}).get('email') or (claims or {}).get('sub')
    user = db.query(User).filter(User.email == email.lower()).first() if email else None
    return user if user and user.is_active else None
def require_roles(*roles: str):
    allowed = set(roles)
    def dependency(user: User = Depends(get_current_user)):
        if user.role not in allowed:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Insufficient permissions')
        return user
    return dependency

require_admin = require_roles('staff', 'hr', 'admin', 'super_admin')

@lru_cache(maxsize=1)
def _neon_keys(url: str):
    with urlopen(url, timeout=5) as response:
        return json.load(response).get('keys', [])

def decode_neon_claims(token: str):
    try:
        header = jwt.get_unverified_header(token)
        claims = jwt.get_unverified_claims(token)
        if settings.neon_auth_issuer and claims.get('iss') != settings.neon_auth_issuer:
            logger.warning('neon_token_rejected reason=issuer_mismatch')
            return None
        audience = claims.get('aud')
        if settings.neon_auth_audience and (
            settings.neon_auth_audience not in audience if isinstance(audience, list)
            else settings.neon_auth_audience != audience
        ):
            logger.warning('neon_token_rejected reason=audience_mismatch')
            return None
        keys = _neon_keys(settings.neon_auth_jwks_url)
        key_data = next((key for key in keys if key.get('kid') == header.get('kid')), None)
        if not key_data:
            logger.warning('neon_token_rejected reason=signing_key_not_found')
            return None
        if header.get('alg') == 'EdDSA' and key_data.get('kty') == 'OKP' and key_data.get('crv') == 'Ed25519':
            return decode_ed25519_claims(token, claims, key_data)
        verified = jwt.decode(token, jwk.construct(key_data), algorithms=[header.get('alg', 'RS256')], options={'verify_aud': False})
        return verified
    except (JWTError, InvalidSignature, OSError, ValueError, KeyError, TypeError) as error:
        logger.warning('neon_token_rejected reason=%s', type(error).__name__)
        return None

def decode_ed25519_claims(token: str, claims: dict, key_data: dict):
    segments = token.split('.')
    if len(segments) != 3:
        return None
    signing_input = f'{segments[0]}.{segments[1]}'.encode('ascii')
    signature = base64.urlsafe_b64decode(f'{segments[2]}===')
    public_key = Ed25519PublicKey.from_public_bytes(
        base64.urlsafe_b64decode(f"{key_data['x']}===")
    )
    public_key.verify(signature, signing_input)
    now = time.time()
    if claims.get('exp') is not None and now >= float(claims['exp']):
        return None
    if claims.get('nbf') is not None and now < float(claims['nbf']):
        return None
    return claims
