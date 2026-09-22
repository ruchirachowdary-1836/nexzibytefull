from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from jose import jwk
import json
from urllib.request import urlopen
from functools import lru_cache
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from .config import settings
from .database import get_db
from .models import User

pwd_context = CryptContext(schemes=['bcrypt'], bcrypt__rounds=settings.bcrypt_rounds, deprecated='auto')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/session')
optional_oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/session', auto_error=False)
def hash_password(password: str): return pwd_context.hash(password)
def verify_password(password: str, hashed: str | None):
    return bool(hashed) and pwd_context.verify(password, hashed)
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    neon_claims = None
    if settings.neon_auth_jwks_url:
        neon_claims = decode_neon_claims(token)
    email = (neon_claims or {}).get('email') or (neon_claims or {}).get('sub')
    neon_user_id = (neon_claims or {}).get('sub') if neon_claims else None
    user = db.query(User).filter(User.neon_auth_user_id == neon_user_id).first() if neon_user_id else None
    if not user and email:
        user = db.query(User).filter(User.email == email.lower()).first()
        if user and neon_user_id and not user.neon_auth_user_id:
            user.neon_auth_user_id = neon_user_id
            db.commit()
    neon_email_verified = bool(
        neon_claims and (neon_claims.get('email_verified') or neon_claims.get('emailVerified'))
    )
    if user and neon_email_verified and not user.is_active:
        user.is_active = True
        user.email_verified = True
        db.commit()
    if not user and email and settings.neon_auth_jwks_url:
        claims = neon_claims or {}
        email_verified = bool(claims.get('email_verified') or claims.get('emailVerified'))
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
    if not user or not user.is_active or (neon_claims is not None and not neon_email_verified):
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
            return None
        audience = claims.get('aud')
        if settings.neon_auth_audience and (
            settings.neon_auth_audience not in audience if isinstance(audience, list)
            else settings.neon_auth_audience != audience
        ):
            return None
        keys = _neon_keys(settings.neon_auth_jwks_url)
        key_data = next((key for key in keys if key.get('kid') == header.get('kid')), None)
        if not key_data:
            return None
        verified = jwt.decode(token, jwk.construct(key_data), algorithms=[header.get('alg', 'RS256')], options={'verify_aud': False})
        return verified
    except (JWTError, OSError, ValueError, KeyError, TypeError):
        return None
