from pydantic import BaseModel
from app.schemas.base import ORMModel


class PrayerCreate(BaseModel):
    title: str
    religion: str
    content_text: str
    audio_url: str | None = None


class PrayerOut(PrayerCreate, ORMModel):
    id: int
    is_active: bool
