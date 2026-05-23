from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.senior import SeniorProfile
from app.repositories.senior_repository import SeniorRepository
from app.schemas.senior import SeniorProfileCreate


class SeniorService:
    def __init__(self, db: Session):
        self.repo = SeniorRepository(db)

    def create_or_update_profile(self, user_id: int, data: SeniorProfileCreate) -> SeniorProfile:
        profile = self.repo.get_by_user_id(user_id)
        if profile:
            for key, value in data.model_dump().items():
                setattr(profile, key, value)
            self.repo.db.commit()
            self.repo.db.refresh(profile)
            return profile
        return self.repo.add(SeniorProfile(user_id=user_id, **data.model_dump()))

    def get_profile(self, user_id: int) -> SeniorProfile:
        profile = self.repo.get_by_user_id(user_id)
        if not profile:
            raise HTTPException(status_code=404, detail="Senior profile not found")
        return profile
