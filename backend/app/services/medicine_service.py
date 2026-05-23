from sqlalchemy.orm import Session
from app.models.medicine import MedicineReminder, MedicineLog
from app.repositories.medicine_repository import MedicineRepository
from app.schemas.medicine import MedicineCreate, MedicineLogCreate


class MedicineService:
    def __init__(self, db: Session):
        self.repo = MedicineRepository(db)

    def create_reminder(self, senior_id: int, data: MedicineCreate) -> MedicineReminder:
        return self.repo.add(MedicineReminder(senior_id=senior_id, **data.model_dump()))

    def list_my_reminders(self, senior_id: int) -> list[MedicineReminder]:
        return self.repo.list_for_senior(senior_id)

    def mark_taken(self, senior_id: int, data: MedicineLogCreate) -> MedicineLog:
        return self.repo.log_taken(senior_id, data.reminder_id, data.taken_on)
