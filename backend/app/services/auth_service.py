from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserCreate


class AuthService:
    """Business logic for registration and login."""

    def __init__(self, db: Session):
        self.users = UserRepository(db)

    def register(self, data: UserCreate) -> User:
        if self.users.get_by_email(data.email):
            raise HTTPException(status_code=409, detail="Email already registered")
        user = User(
            full_name=data.full_name,
            email=data.email,
            phone=data.phone,
            password_hash=hash_password(data.password),
            role=data.role,
        )
        return self.users.add(user)

    def login(self, email: str, password: str) -> tuple[str, User]:
        user = self.users.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        token = create_access_token(subject=str(user.id), extra_claims={"role": user.role.value})
        return token, user
