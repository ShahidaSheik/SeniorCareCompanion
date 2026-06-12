from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.prayer import PrayerCreate, PrayerOut
from app.services.prayer_service import PrayerService
from app.services.user_context import get_current_user, require_admin

router = APIRouter()


@router.post("", response_model=PrayerOut)
def create_prayer(
    data: PrayerCreate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    # Only admin can add prayer content/audio links.
    return PrayerService(db).create(data)


@router.get("", response_model=list[PrayerOut])
def list_prayers(
    religion: str = Query(default="General"),
    language: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return PrayerService(db).list_by_religion(religion, language)


@router.get("/my", response_model=list[PrayerOut])
def list_my_prayers(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Automatically uses the religion/language selected during registration.
    return PrayerService(db).list_by_religion(
        current_user.religion_preference or "General",
        current_user.preferred_language or "English",
    )
