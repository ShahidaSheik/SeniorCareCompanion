from sqlalchemy.orm import Session
from app.models.care_request import CareRequest
from app.repositories.care_request_repository import CareRequestRepository
from app.schemas.care_request import CareRequestCreate


class CareRequestService:
    def __init__(self, db: Session):
        self.repo = CareRequestRepository(db)

    def create(self, senior_id: int, data: CareRequestCreate) -> CareRequest:
        return self.repo.add(CareRequest(senior_id=senior_id, **data.model_dump()))

    def list_my_requests(self, senior_id: int) -> list[CareRequest]:
        return self.repo.list_for_senior(senior_id)
