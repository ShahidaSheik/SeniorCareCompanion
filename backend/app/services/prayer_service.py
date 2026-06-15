from sqlalchemy.orm import Session
from app.models.prayer import PrayerContent
from app.repositories.prayer_repository import PrayerRepository
from app.schemas.prayer import PrayerCreate, PrayerUpdate


class PrayerService:
    def __init__(self, db: Session):
        self.repo = PrayerRepository(db)

    def create(self, data: PrayerCreate) -> PrayerContent:
        return self.repo.add(PrayerContent(**data.model_dump()))

    def list_by_religion(self, religion: str, language: str | None = None) -> list[PrayerContent]:
        return self.repo.list_by_religion(religion, language)
    
    def list_all(self) -> list[PrayerContent]:
        return self.repo.list_all_admin()

    def update(self, prayer_id: int, data: PrayerUpdate) -> PrayerContent:
        prayer = self.repo.get(prayer_id)
        if not prayer:
            raise HTTPException(status_code=404, detail="Prayer not found")
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(prayer, key, value)
        self.repo.db.commit()
        self.repo.db.refresh(prayer)
        return prayer

    def deactivate(self, prayer_id: int) -> dict:
        self.update(prayer_id, PrayerUpdate(is_active=False))
        return {"message": "Prayer deactivated", "id": prayer_id}
