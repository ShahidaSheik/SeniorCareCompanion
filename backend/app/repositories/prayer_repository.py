from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.prayer import PrayerContent
from app.repositories.base import BaseRepository


class PrayerRepository(BaseRepository[PrayerContent]):
    def __init__(self, db: Session):
        super().__init__(PrayerContent, db)

    def list_by_religion(self, religion: str) -> list[PrayerContent]:
        stmt = select(PrayerContent).where(PrayerContent.religion == religion, PrayerContent.is_active == True)
        return list(self.db.scalars(stmt).all())
