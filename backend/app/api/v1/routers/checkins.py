from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.checkin import CheckInCreate, CheckInOut
from app.services.checkin_service import CheckInService
from app.services.user_context import get_current_user

router = APIRouter()


@router.post("", response_model=CheckInOut)
def create_checkin(data: CheckInCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return CheckInService(db).create(current_user.id, data)


@router.get("/history", response_model=list[CheckInOut])
def my_checkin_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return CheckInService(db).history(current_user.id)
