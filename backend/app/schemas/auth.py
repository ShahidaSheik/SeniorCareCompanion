from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole
from app.schemas.base import ORMModel


class UserCreate(BaseModel):
    """Registration payload.

    Seniors select religion and language during registration so the app can
    automatically show matching prayers after login.
    """
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str | None = None
    password: str = Field(min_length=6)
    role: UserRole = UserRole.SENIOR
    preferred_language: str = "English"
    religion_preference: str = "General"
    care_setting: str = "home"  # home or old_age_home


class UserOut(ORMModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str | None
    role: UserRole
    is_active: bool
    preferred_language: str | None = None
    religion_preference: str | None = None
    care_setting: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
