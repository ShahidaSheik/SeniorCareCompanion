from pydantic import BaseModel
from app.schemas.base import ORMModel


class PrayerCreate(BaseModel):
    title: str
    religion: str
    language: str = "English"
    content_text: str
    audio_url: str | None = None
    source_url: str | None = None

class PrayerUpdate(BaseModel):
    title: str | None = None
    religion: str | None = None
    language: str | None = None
    content_text: str | None = None
    audio_url: str | None = None
    source_url: str | None = None
    is_active: bool | None = None

class PrayerOut(PrayerCreate, ORMModel):
    id: int
    is_active: bool
