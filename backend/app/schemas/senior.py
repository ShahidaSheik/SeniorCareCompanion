from datetime import date
from pydantic import BaseModel
from app.schemas.base import ORMModel


class SeniorProfileCreate(BaseModel):
    date_of_birth: date | None = None
    gender: str | None = None
    blood_group: str | None = None
    allergies: str | None = None
    current_medical_conditions: str | None = None
    address: str | None = None
    preferred_language: str = "English"
    religion_preference: str | None = None


class SeniorProfileOut(SeniorProfileCreate, ORMModel):
    id: int
    user_id: int
