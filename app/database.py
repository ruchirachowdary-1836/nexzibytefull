from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from .config import settings

database_url = settings.database_url or settings.db_url
connect_args = {"check_same_thread": False} if database_url.startswith("sqlite") else {}
pool_options = {} if database_url.startswith("sqlite") else {
    "pool_size": 5,
    "max_overflow": 10,
    "pool_recycle": 1800,
}
engine = create_engine(database_url, connect_args=connect_args, pool_pre_ping=True, **pool_options)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
