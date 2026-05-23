from datetime import date
from pydantic import BaseModel, Field
from app.schemas.base import ORMModel


class CheckInCreate(BaseModel):
    checkin_date: date
    mood: str
    pain_level: int = Field(ge=0, le=10)
    notes: str | None = None


class CheckInOut(CheckInCreate, ORMModel):
    id: int
    senior_id: int
