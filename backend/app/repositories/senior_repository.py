from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.senior import SeniorProfile
from app.repositories.base import BaseRepository


class SeniorRepository(BaseRepository[SeniorProfile]):
    def __init__(self, db: Session):
        super().__init__(SeniorProfile, db)

    def get_by_user_id(self, user_id: int) -> SeniorProfile | None:
        return self.db.scalar(select(SeniorProfile).where(SeniorProfile.user_id == user_id))
