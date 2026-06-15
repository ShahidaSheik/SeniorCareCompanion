from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from app.models.prayer import PrayerContent
from app.repositories.base import BaseRepository


class PrayerRepository(BaseRepository[PrayerContent]):
    def __init__(self, db: Session):
        super().__init__(PrayerContent, db)

    def list_by_religion(self, religion: str, language: str | None = None) -> list[PrayerContent]:
        # Also include General content for users who selected a specific religion.
        stmt = select(PrayerContent).where(
            PrayerContent.is_active == True,
            or_(PrayerContent.religion == religion, PrayerContent.religion == "General"),
        )
        if language:
            stmt = stmt.where(or_(PrayerContent.language == language, PrayerContent.language == "English"))
        return list(self.db.scalars(stmt).all())
    
    def list_all_admin(self) -> list[PrayerContent]:
        stmt = select(PrayerContent).order_by(PrayerContent.created_at.desc())
        return list(self.db.scalars(stmt).all())
