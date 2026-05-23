from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.emergency import EmergencyContact, EmergencyAlert
from app.repositories.base import BaseRepository


class EmergencyContactRepository(BaseRepository[EmergencyContact]):
    def __init__(self, db: Session):
        super().__init__(EmergencyContact, db)

    def list_for_senior(self, senior_id: int) -> list[EmergencyContact]:
        return list(self.db.scalars(select(EmergencyContact).where(EmergencyContact.senior_id == senior_id)).all())


class EmergencyAlertRepository(BaseRepository[EmergencyAlert]):
    def __init__(self, db: Session):
        super().__init__(EmergencyAlert, db)
