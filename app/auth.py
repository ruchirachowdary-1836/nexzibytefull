from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from jose import jwk
import json
from urllib.request import urlopen
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from .config import settings
from .database import get_db
from .models import User

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/login')
optional_oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/login', auto_error=False)
def hash_password(password: str): return pwd_context.hash(password)
def verify_password(password: str, hashed: str | None):
    return bool(hashed) and pwd_context.verify(password, hashed)
def create_access_token(subject: str):
    return jwt.encode({'sub': subject, 'exp': datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)}, settings.jwt_secret, algorithm='HS256')
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    email = decode_local_email(token)
    if not email and settings.neon_auth_jwks_url:
        email = decode_neon_email(token)
    user = db.query(User).filter(User.email == email.lower()).first() if email else None
    if not user and email and settings.neon_auth_jwks_url:
        claims = decode_neon_claims(token)
        user = User(
            name=(claims or {}).get('name') or (claims or {}).get('user_metadata', {}).get('name') or email.split('@')[0],
            email=email.lower(),
            email_verified=True,
            password_hash=None,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    if not user or not user.is_active: raise HTTPException(status_code=401, detail='Invalid authentication credentials')
    return user
def get_optional_user(token: str | None = Depends(optional_oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        return None
    email = decode_local_email(token)
    if not email and settings.neon_auth_jwks_url:
        email = decode_neon_email(token)
    user = db.query(User).filter(User.email == email.lower()).first() if email else None
    return user if user and user.is_active else None
def require_admin(user: User = Depends(get_current_user)):
    if user.role not in {'admin', 'staff', 'hr'}: raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Staff or HR access required')
    return user

def decode_local_email(token: str):
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=['HS256']).get('sub')
    except JWTError:
        return None

def decode_neon_email(token: str):
    claims = decode_neon_claims(token)
    return (claims or {}).get('email') or (claims or {}).get('sub')

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
        with urlopen(settings.neon_auth_jwks_url, timeout=5) as response:
            keys = json.load(response).get('keys', [])
        key_data = next((key for key in keys if key.get('kid') == header.get('kid')), None)
        if not key_data:
            return None
        verified = jwt.decode(token, jwk.construct(key_data), algorithms=[header.get('alg', 'RS256')], options={'verify_aud': False})
        return verified
    except (JWTError, OSError, ValueError, KeyError, TypeError):
        return None
