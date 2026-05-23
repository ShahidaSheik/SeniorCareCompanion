from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.medicine import MedicineCreate, MedicineLogCreate, MedicineOut
from app.services.medicine_service import MedicineService
from app.services.user_context import get_current_user

router = APIRouter()


@router.post("", response_model=MedicineOut)
def create_reminder(data: MedicineCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return MedicineService(db).create_reminder(current_user.id, data)


@router.get("", response_model=list[MedicineOut])
def list_reminders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return MedicineService(db).list_my_reminders(current_user.id)


@router.post("/taken")
def mark_taken(data: MedicineLogCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    log = MedicineService(db).mark_taken(current_user.id, data)
    return {"message": "Medicine marked as taken", "log_id": log.id}
