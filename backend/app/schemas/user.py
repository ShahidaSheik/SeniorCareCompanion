from pydantic import BaseModel
from app.schemas.auth import UserOut

# Kept as a separate file so future user-management APIs do not depend on auth schemas.
UserListOut = UserOut

class UserUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    preferred_language: str | None = None
    religion_preference: str | None = None
    care_setting: str | None = None
    is_active: bool | None = None
