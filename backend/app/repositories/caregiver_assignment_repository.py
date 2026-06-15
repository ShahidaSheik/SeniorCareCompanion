from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.caregiver_assignment import CaregiverSeniorAssignment
from app.models.user import User, UserRole
from app.repositories.base import BaseRepository


class CaregiverAssignmentRepository(BaseRepository[CaregiverSeniorAssignment]):
    """Database queries related to caregiver-senior mapping."""

    def __init__(self, db: Session):
        super().__init__(CaregiverSeniorAssignment, db)

    def is_assigned(self, caregiver_id: int, senior_id: int) -> bool:
        stmt = select(CaregiverSeniorAssignment.id).where(
            CaregiverSeniorAssignment.caregiver_id == caregiver_id,
            CaregiverSeniorAssignment.senior_id == senior_id,
        )
        return self.db.scalar(stmt) is not None

    def list_assigned_seniors(self, caregiver_id: int) -> list[User]:
        stmt = (
            select(User)
            .join(CaregiverSeniorAssignment, CaregiverSeniorAssignment.senior_id == User.id)
            .where(
                CaregiverSeniorAssignment.caregiver_id == caregiver_id,
                User.role == UserRole.SENIOR,
            )
            .order_by(User.full_name)
        )
        return list(self.db.scalars(stmt).all())
    
    def is_senior_assigned_to_caregiver(
        self,
        senior_id: int,
        caregiver_id: int,
    ) -> bool:
        stmt = select(CaregiverSeniorAssignment).where(
            CaregiverSeniorAssignment.senior_id == senior_id,
            CaregiverSeniorAssignment.caregiver_id == caregiver_id,
        )

        return self.db.scalar(stmt) is not None
