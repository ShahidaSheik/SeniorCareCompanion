from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session

from app.core.config import settings

# pool_pre_ping prevents stale MySQL connection errors after idle time.
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy 2.0 ORM models."""
    pass


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that gives one DB session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
