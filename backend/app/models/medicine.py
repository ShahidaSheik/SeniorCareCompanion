from datetime import date, time
from sqlalchemy import Boolean, Date, ForeignKey, String, Text, Time, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base_mixins import TimestampMixin


class MedicineReminder(Base, TimestampMixin):
    __tablename__ = "medicine_reminders"

    id: Mapped[int] = mapped_column(primary_key=True)
    senior_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    medicine_name: Mapped[str] = mapped_column(String(150), nullable=False)
    dosage: Mapped[str] = mapped_column(String(80), nullable=False)
    reminder_time: Mapped[time] = mapped_column(Time, nullable=False)
    instructions: Mapped[str | None] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class MedicineLog(Base, TimestampMixin):
    __tablename__ = "medicine_logs"
    __table_args__ = (UniqueConstraint("reminder_id", "taken_on", name="uq_medicine_log_day"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    reminder_id: Mapped[int] = mapped_column(ForeignKey("medicine_reminders.id", ondelete="CASCADE"), index=True)
    senior_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    taken_on: Mapped[date] = mapped_column(Date, nullable=False)
    is_taken: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
