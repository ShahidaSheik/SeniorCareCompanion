from datetime import date
from sqlalchemy import Boolean, Date, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base_mixins import TimestampMixin


class ExerciseActivity(Base, TimestampMixin):
    __tablename__ = "exercise_activities"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), index=True, nullable=False)  # chair_yoga, breathing, walk
    difficulty: Mapped[str] = mapped_column(String(30), default="beginner", nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    video_url: Mapped[str | None] = mapped_column(String(500))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class ExerciseCompletion(Base, TimestampMixin):
    __tablename__ = "exercise_completions"
    __table_args__ = (UniqueConstraint("senior_id", "activity_id", "completed_on", name="uq_daily_activity"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    senior_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    activity_id: Mapped[int] = mapped_column(ForeignKey("exercise_activities.id", ondelete="CASCADE"), index=True)
    completed_on: Mapped[date] = mapped_column(Date, nullable=False)
