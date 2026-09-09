from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from .config import settings
from .database import get_db
from .models import User

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/login')
optional_oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/login', auto_error=False)
def hash_password(password: str): return pwd_context.hash(password)
def verify_password(password: str, hashed: str): return pwd_context.verify(password, hashed)
def create_access_token(subject: str):
    return jwt.encode({'sub': subject, 'exp': datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)}, settings.jwt_secret, algorithm='HS256')
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try: email = jwt.decode(token, settings.jwt_secret, algorithms=['HS256']).get('sub')
    except JWTError: email = None
    user = db.query(User).filter(User.email == email).first() if email else None
    if not user or not user.is_active: raise HTTPException(status_code=401, detail='Invalid authentication credentials')
    return user
def get_optional_user(token: str | None = Depends(optional_oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        return None
    try: email = jwt.decode(token, settings.jwt_secret, algorithms=['HS256']).get('sub')
    except JWTError: return None
    user = db.query(User).filter(User.email == email).first() if email else None
    return user if user and user.is_active else None
def require_admin(user: User = Depends(get_current_user)):
    if user.role != 'admin': raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Admin access required')
    return user
