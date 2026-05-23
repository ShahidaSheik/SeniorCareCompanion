from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.emergency import EmergencyContactCreate, EmergencyContactOut, SOSCreate, SOSOut
from app.services.emergency_service import EmergencyService
from app.services.user_context import get_current_user

router = APIRouter()


@router.post("/contacts", response_model=EmergencyContactOut)
def add_contact(data: EmergencyContactCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return EmergencyService(db).add_contact(current_user.id, data)


@router.get("/contacts", response_model=list[EmergencyContactOut])
def list_contacts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return EmergencyService(db).list_contacts(current_user.id)


@router.post("/sos", response_model=SOSOut)
def trigger_sos(data: SOSCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return EmergencyService(db).trigger_sos(current_user.id, data)
