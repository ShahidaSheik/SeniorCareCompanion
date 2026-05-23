from datetime import date
from sqlalchemy import Date, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base_mixins import TimestampMixin


class DailyCheckIn(Base, TimestampMixin):
    __tablename__ = "daily_checkins"
    __table_args__ = (UniqueConstraint("senior_id", "checkin_date", name="uq_senior_daily_checkin"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    senior_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    checkin_date: Mapped[date] = mapped_column(Date, nullable=False)
    mood: Mapped[str] = mapped_column(String(30), nullable=False)  # happy, normal, sad, anxious
    pain_level: Mapped[int] = mapped_column(Integer, default=0, nullable=False)  # 0 to 10
    notes: Mapped[str | None] = mapped_column(Text)
