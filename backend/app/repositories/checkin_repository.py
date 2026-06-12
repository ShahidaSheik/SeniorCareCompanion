from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.checkin import CheckIn
from app.repositories.base import BaseRepository


class CheckInRepository(BaseRepository[CheckIn]):
    def __init__(self, db: Session):
        super().__init__(CheckIn, db)

    def list_for_senior(self, senior_id: int, limit: int = 30) -> list[CheckIn]:
        stmt = select(CheckIn).where(CheckIn.senior_id == senior_id).order_by(CheckIn.checkin_date.desc()).limit(limit)
        return list(self.db.scalars(stmt).all())
