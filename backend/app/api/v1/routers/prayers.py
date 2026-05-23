from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.prayer import PrayerCreate, PrayerOut
from app.services.prayer_service import PrayerService

router = APIRouter()


@router.post("", response_model=PrayerOut)
def create_prayer(data: PrayerCreate, db: Session = Depends(get_db)):
    return PrayerService(db).create(data)


@router.get("", response_model=list[PrayerOut])
def list_prayers(religion: str = Query(default="General"), db: Session = Depends(get_db)):
    return PrayerService(db).list_by_religion(religion)
