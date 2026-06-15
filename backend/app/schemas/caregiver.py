from pydantic import BaseModel

from app.schemas.auth import UserOut
from app.schemas.base import ORMModel


class CaregiverAssignmentCreate(BaseModel):
    """Admin payload to assign one caregiver to one senior."""
    caregiver_id: int
    senior_id: int


class CaregiverAssignmentOut(ORMModel):
    id: int
    caregiver_id: int
    senior_id: int


class AssignedSeniorOut(UserOut):
    pass
