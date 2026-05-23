from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.senior import SeniorProfileCreate, SeniorProfileOut
from app.services.senior_service import SeniorService
from app.services.user_context import get_current_user

router = APIRouter()


@router.put("/me/profile", response_model=SeniorProfileOut)
def create_or_update_my_profile(data: SeniorProfileCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return SeniorService(db).create_or_update_profile(current_user.id, data)


@router.get("/me/profile", response_model=SeniorProfileOut)
def get_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return SeniorService(db).get_profile(current_user.id)
