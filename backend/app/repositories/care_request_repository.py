from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.care_request import CareRequest
from app.repositories.base import BaseRepository


class CareRequestRepository(BaseRepository[CareRequest]):
    def __init__(self, db: Session):
        super().__init__(CareRequest, db)

    def list_for_senior(self, senior_id: int) -> list[CareRequest]:
        return list(self.db.scalars(select(CareRequest).where(CareRequest.senior_id == senior_id)).all())
