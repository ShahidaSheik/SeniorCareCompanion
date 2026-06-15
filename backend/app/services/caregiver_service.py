from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.caregiver_assignment import CaregiverSeniorAssignment
from app.models.user import User, UserRole
from app.repositories.caregiver_assignment_repository import CaregiverAssignmentRepository
from app.repositories.user_repository import UserRepository
from app.schemas.caregiver import CaregiverAssignmentCreate


class CaregiverService:
    """Business rules for assigning caregivers to seniors."""

    def __init__(self, db: Session):
        self.db = db
        self.assignments = CaregiverAssignmentRepository(db)
        self.users = UserRepository(db)

    def assign_senior(self, data: CaregiverAssignmentCreate, current_user: User) -> CaregiverSeniorAssignment:
        # Admin manages residents and caregiver mapping. Admin still cannot add medicines.
        if current_user.role != UserRole.ADMIN:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can assign seniors to caregivers")

        caregiver = self.users.get(data.caregiver_id)
        senior = self.users.get(data.senior_id)

        if not caregiver or caregiver.role != UserRole.CAREGIVER:
            raise HTTPException(status_code=400, detail="caregiver_id must belong to a caregiver user")
        if not senior or senior.role != UserRole.SENIOR:
            raise HTTPException(status_code=400, detail="senior_id must belong to a senior user")

        if self.assignments.is_assigned(data.caregiver_id, data.senior_id):
            raise HTTPException(status_code=409, detail="This caregiver is already assigned to this senior")

        return self.assignments.add(
            CaregiverSeniorAssignment(caregiver_id=data.caregiver_id, senior_id=data.senior_id)
        )

    def list_my_seniors(self, current_user: User):
        if current_user.role != UserRole.CAREGIVER:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only caregivers can view assigned seniors")
        return self.assignments.list_assigned_seniors(current_user.id)
