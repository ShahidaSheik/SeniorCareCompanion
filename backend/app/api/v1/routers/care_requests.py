from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.care_request import CareRequestCreate, CareRequestOut
from app.services.care_request_service import CareRequestService
from app.services.user_context import get_current_user

router = APIRouter()


@router.post("", response_model=CareRequestOut)
def create_request(data: CareRequestCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return CareRequestService(db).create(current_user.id, data)


@router.get("", response_model=list[CareRequestOut])
def list_my_requests(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return CareRequestService(db).list_my_requests(current_user.id)
