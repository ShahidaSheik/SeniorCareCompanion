from sqlalchemy.orm import Session
from app.models.prayer import PrayerContent
from app.repositories.prayer_repository import PrayerRepository
from app.schemas.prayer import PrayerCreate


class PrayerService:
    def __init__(self, db: Session):
        self.repo = PrayerRepository(db)

    def create(self, data: PrayerCreate) -> PrayerContent:
        return self.repo.add(PrayerContent(**data.model_dump()))

    def list_by_religion(self, religion: str) -> list[PrayerContent]:
        return self.repo.list_by_religion(religion)
