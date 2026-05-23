from sqlalchemy.orm import Session
from app.models.emergency import EmergencyAlert, EmergencyContact
from app.repositories.emergency_repository import EmergencyAlertRepository, EmergencyContactRepository
from app.schemas.emergency import EmergencyContactCreate, SOSCreate


class EmergencyService:
    def __init__(self, db: Session):
        self.contacts = EmergencyContactRepository(db)
        self.alerts = EmergencyAlertRepository(db)

    def add_contact(self, senior_id: int, data: EmergencyContactCreate) -> EmergencyContact:
        return self.contacts.add(EmergencyContact(senior_id=senior_id, **data.model_dump()))

    def list_contacts(self, senior_id: int) -> list[EmergencyContact]:
        return self.contacts.list_for_senior(senior_id)

    def trigger_sos(self, senior_id: int, data: SOSCreate) -> EmergencyAlert:
        # Real production app should integrate SMS/WhatsApp/push notification here.
        alert = EmergencyAlert(senior_id=senior_id, **data.model_dump())
        return self.alerts.add(alert)
