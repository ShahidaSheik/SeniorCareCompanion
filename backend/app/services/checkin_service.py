from sqlalchemy.orm import Session
from app.models.checkin import DailyCheckIn
from app.repositories.checkin_repository import CheckInRepository
from app.schemas.checkin import CheckInCreate


class CheckInService:
    def __init__(self, db: Session):
        self.repo = CheckInRepository(db)

    def create(self, senior_id: int, data: CheckInCreate) -> DailyCheckIn:
        return self.repo.add(DailyCheckIn(senior_id=senior_id, **data.model_dump()))

    def history(self, senior_id: int) -> list[DailyCheckIn]:
        return self.repo.list_for_senior(senior_id)
