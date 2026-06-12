from datetime import date
from pydantic import BaseModel, Field
from app.schemas.base import ORMModel


class ExerciseCreate(BaseModel):
    title: str
    description: str
    category: str
    difficulty: str = "beginner"
    duration_minutes: int = Field(default=10, ge=1, le=120)
    language: str = "English"
    audio_url: str | None = None
    video_url: str | None = None
    source_url: str | None = None


class ExerciseOut(ExerciseCreate, ORMModel):
    id: int
    is_active: bool


class CompletionCreate(BaseModel):
    activity_id: int
    completed_on: date
