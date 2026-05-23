from datetime import date, time
from pydantic import BaseModel
from app.schemas.base import ORMModel


class MedicineCreate(BaseModel):
    medicine_name: str
    dosage: str
    reminder_time: time
    instructions: str | None = None


class MedicineOut(MedicineCreate, ORMModel):
    id: int
    senior_id: int
    is_active: bool


class MedicineLogCreate(BaseModel):
    reminder_id: int
    taken_on: date
