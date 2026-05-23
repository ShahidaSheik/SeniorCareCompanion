from datetime import date
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.medicine import MedicineReminder, MedicineLog
from app.repositories.base import BaseRepository


class MedicineRepository(BaseRepository[MedicineReminder]):
    def __init__(self, db: Session):
        super().__init__(MedicineReminder, db)

    def list_for_senior(self, senior_id: int) -> list[MedicineReminder]:
        stmt = select(MedicineReminder).where(MedicineReminder.senior_id == senior_id, MedicineReminder.is_active == True)
        return list(self.db.scalars(stmt).all())

    def log_taken(self, senior_id: int, reminder_id: int, taken_on: date) -> MedicineLog:
        log = MedicineLog(senior_id=senior_id, reminder_id=reminder_id, taken_on=taken_on, is_taken=True)
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log
