from datetime import date, datetime, time
from pydantic import BaseModel, Field

from app.schemas.base import ORMModel


class MedicineCreate(BaseModel):
    senior_id: int
    medicine_name: str
    dosage: str

    morning: bool = False
    afternoon: bool = False
    night: bool = False

    frequency: str = "daily"
    
    start_date: date
    end_date: date | None = None

    prescribed_by: str | None = None
    notes: str | None = None
    instructions: str | None = None


class MedicineUpdate(BaseModel):
    medicine_name: str | None = None
    dosage: str | None = None

    morning: bool | None = None
    afternoon: bool | None = None
    night: bool | None = None

    frequency: str | None = None
    
    start_date: date | None = None
    end_date: date | None = None

    prescribed_by: str | None = None
    notes: str | None = None
    instructions: str | None = None
    is_active: bool | None = None


class MedicineOut(ORMModel):
    id: int
    senior_id: int
    caregiver_id: int | None = None

    medicine_name: str
    dosage: str

    morning: bool
    afternoon: bool
    night: bool

    frequency: str
    
    start_date: date
    end_date: date | None = None

    prescribed_by: str | None = None
    notes: str | None = None
    instructions: str | None = None
    safety_warning: str
    
    created_at: datetime
    updated_at: datetime | None = None


class MedicineLogCreate(BaseModel):
    status: str = Field(default="taken")
    remarks: str | None = None


class MedicineLogOut(ORMModel):
    id: int
    reminder_id: int
    senior_id: int
    taken_on: date
    is_taken: bool
    created_at: datetime