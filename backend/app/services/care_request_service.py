from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.care_request import CareRequest
from app.models.user import User, UserRole
from app.repositories.care_request_repository import CareRequestRepository
from app.schemas.care_request import CareRequestCreate, CareRequestStatusUpdate


class CareRequestService:
    def __init__(self, db: Session):
        self.repo = CareRequestRepository(db)

    def create(self, current_user: User, data: CareRequestCreate) -> CareRequest:
        if current_user.role != UserRole.SENIOR:
            raise HTTPException(status_code=403, detail="Only seniors can create home care requests")
        return self.repo.add(CareRequest(senior_id=current_user.id, **data.model_dump()))

    def list_requests(self, current_user: User) -> list[CareRequest]:
        if current_user.role == UserRole.ADMIN:
            return self.repo.list_all()
        if current_user.role == UserRole.SENIOR:
            return self.repo.list_for_senior(current_user.id)
        raise HTTPException(status_code=403, detail="Not allowed")

    def update_status(self, current_user: User, request_id: int, data: CareRequestStatusUpdate) -> CareRequest:
        if current_user.role != UserRole.ADMIN:
            raise HTTPException(status_code=403, detail="Only admin can update home care request status")
        request = self.repo.get(request_id)
        if not request:
            raise HTTPException(status_code=404, detail="Home care request not found")
        allowed = {"pending", "accepted", "completed", "cancelled", "rejected"}
        if data.status not in allowed:
            raise HTTPException(status_code=400, detail=f"Invalid status. Use one of {sorted(allowed)}")
        request.status = data.status
        self.repo.db.commit()
        self.repo.db.refresh(request)
        return request
