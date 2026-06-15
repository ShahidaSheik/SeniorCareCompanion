from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base_mixins import TimestampMixin


class CaregiverSeniorAssignment(Base, TimestampMixin):
    """Maps a caregiver to a senior.

    This table is important because caregivers must not see or modify every
    senior in the system. They can manage medicines only for assigned seniors.
    """

    __tablename__ = "caregiver_senior_assignments"
    __table_args__ = (
        UniqueConstraint("caregiver_id", "senior_id", name="uq_caregiver_senior"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    caregiver_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    senior_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
