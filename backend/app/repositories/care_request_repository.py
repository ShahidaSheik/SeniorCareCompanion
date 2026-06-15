from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.care_request import CareRequest
from app.repositories.base import BaseRepository

class CareRequestRepository(BaseRepository[CareRequest]):
    def __init__(self, db: Session):
        super().__init__(CareRequest, db)

    def list_for_senior(self, senior_id: int) -> list[CareRequest]:
        stmt = select(CareRequest).where(CareRequest.senior_id == senior_id).order_by(CareRequest.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def list_all(self) -> list[CareRequest]:
        stmt = select(CareRequest).order_by(CareRequest.created_at.desc())
        return list(self.db.scalars(stmt).all())
