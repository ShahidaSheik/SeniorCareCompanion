from datetime import date, time
from sqlalchemy import Boolean, Date, ForeignKey, String, Text, Time, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base_mixins import TimestampMixin


class MedicineReminder(Base, TimestampMixin):
    __tablename__ = "medicine_reminders"

    id: Mapped[int] = mapped_column(primary_key=True)

    senior_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    caregiver_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        index=True,
        nullable=True,
    )

    medicine_name: Mapped[str] = mapped_column(String(150), nullable=False)
    dosage: Mapped[str] = mapped_column(String(80), nullable=False)

    # 1-0-1 pattern is derived from these three fields
    morning: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    afternoon: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    night: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    frequency: Mapped[str] = mapped_column(String(50), default="daily", nullable=False)

    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    prescribed_by: Mapped[str | None] = mapped_column(String(120), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    instructions: Mapped[str | None] = mapped_column(Text, nullable=True)

    safety_warning: Mapped[str] = mapped_column(
        String(255),
        default="Consult doctor before changing or stopping medicine.",
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    @property
    def dosage_pattern(self) -> str:
        return f"{1 if self.morning else 0}-{1 if self.afternoon else 0}-{1 if self.night else 0}"


class MedicineLog(Base, TimestampMixin):
    __tablename__ = "medicine_logs"
    __table_args__ = (UniqueConstraint("reminder_id", "taken_on", name="uq_medicine_log_day"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    reminder_id: Mapped[int] = mapped_column(ForeignKey("medicine_reminders.id", ondelete="CASCADE"), index=True)
    senior_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    taken_on: Mapped[date] = mapped_column(Date, nullable=False)
    is_taken: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)