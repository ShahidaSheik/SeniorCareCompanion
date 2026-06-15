from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.prayer import PrayerCreate, PrayerOut, PrayerUpdate
from app.services.prayer_service import PrayerService
from app.services.user_context import get_current_user, require_admin

router = APIRouter()


@router.post("", response_model=PrayerOut)
def create_prayer(data: PrayerCreate, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return PrayerService(db).create(data)


@router.get("", response_model=list[PrayerOut])
def list_prayers(religion: str = Query(default="General"), language: str | None = Query(default=None), db: Session = Depends(get_db)):
    return PrayerService(db).list_by_religion(religion, language)


@router.get("/admin", response_model=list[PrayerOut])
def list_prayers_admin(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return PrayerService(db).list_all()


@router.get("/my", response_model=list[PrayerOut])
def list_my_prayers(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return PrayerService(db).list_by_religion(current_user.religion_preference or "General", current_user.preferred_language or "English")


@router.put("/{prayer_id}", response_model=PrayerOut)
def update_prayer(prayer_id: int, data: PrayerUpdate, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return PrayerService(db).update(prayer_id, data)


@router.delete("/{prayer_id}")
def delete_prayer(prayer_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return PrayerService(db).deactivate(prayer_id)
