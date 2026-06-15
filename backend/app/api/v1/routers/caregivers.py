from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.caregiver import AssignedSeniorOut, CaregiverAssignmentCreate, CaregiverAssignmentOut
from app.services.caregiver_service import CaregiverService
from app.services.user_context import get_current_user

router = APIRouter()


@router.post("/assignments", response_model=CaregiverAssignmentOut)
def assign_senior_to_caregiver(
    data: CaregiverAssignmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Admin assigns a caregiver to a senior resident."""
    return CaregiverService(db).assign_senior(data, current_user)


@router.get("/my-seniors", response_model=list[AssignedSeniorOut])
def list_my_assigned_seniors(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Caregiver sees only seniors assigned to them."""
    return CaregiverService(db).list_my_seniors(current_user)
