from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.checkin import DailyCheckIn
from app.repositories.base import BaseRepository


class CheckInRepository(BaseRepository[DailyCheckIn]):
    def __init__(self, db: Session):
        super().__init__(DailyCheckIn, db)

    def list_for_senior(self, senior_id: int, limit: int = 30) -> list[DailyCheckIn]:
        stmt = select(DailyCheckIn).where(DailyCheckIn.senior_id == senior_id).order_by(DailyCheckIn.checkin_date.desc()).limit(limit)
        return list(self.db.scalars(stmt).all())
