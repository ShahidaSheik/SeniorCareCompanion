from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.medicine import MedicineReminder, MedicineLog


class MedicineRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, medicine: MedicineReminder) -> MedicineReminder:
        self.db.add(medicine)
        self.db.commit()
        self.db.refresh(medicine)
        return medicine

    def get_by_id(self, medicine_id: int) -> MedicineReminder | None:
        stmt = select(MedicineReminder).where(MedicineReminder.id == medicine_id)
        return self.db.scalar(stmt)

    def list_by_senior(self, senior_id: int):
        stmt = (
            select(MedicineReminder)
            .where(
                MedicineReminder.senior_id == senior_id,
                MedicineReminder.is_active == True,
            )
            .order_by(MedicineReminder.created_at.desc())
        )
        return self.db.scalars(stmt).all()

    def list_by_caregiver(self, caregiver_id: int):
        stmt = (
            select(MedicineReminder)
            .where(MedicineReminder.caregiver_id == caregiver_id)
            .order_by(MedicineReminder.created_at.desc())
        )
        return self.db.scalars(stmt).all()

    def update(self, medicine: MedicineReminder) -> MedicineReminder:
        self.db.commit()
        self.db.refresh(medicine)
        return medicine

    def create_log(self, log: MedicineLog):
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log

    def list_logs_by_senior(self, senior_id: int):
        stmt = (
            select(MedicineLog)
            .where(MedicineLog.senior_id == senior_id)
            .order_by(MedicineLog.created_at.desc())
        )
        return self.db.scalars(stmt).all()