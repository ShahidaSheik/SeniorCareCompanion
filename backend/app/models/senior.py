from datetime import date
from sqlalchemy import Date, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base_mixins import TimestampMixin


class SeniorProfile(Base, TimestampMixin):
    __tablename__ = "senior_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)
    date_of_birth: Mapped[date | None] = mapped_column(Date)
    gender: Mapped[str | None] = mapped_column(String(20))
    blood_group: Mapped[str | None] = mapped_column(String(10))
    allergies: Mapped[str | None] = mapped_column(Text)
    current_medical_conditions: Mapped[str | None] = mapped_column(Text)
    address: Mapped[str | None] = mapped_column(Text)
    preferred_language: Mapped[str] = mapped_column(String(30), default="English", nullable=False)
    religion_preference: Mapped[str | None] = mapped_column(String(50))

    user: Mapped["User"] = relationship(back_populates="senior_profile")
