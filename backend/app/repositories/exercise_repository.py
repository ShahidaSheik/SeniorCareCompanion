from datetime import date
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from app.models.exercise import ExerciseActivity, ExerciseCompletion
from app.repositories.base import BaseRepository


class ExerciseRepository(BaseRepository[ExerciseActivity]):
    def __init__(self, db: Session):
        super().__init__(ExerciseActivity, db)

    def list_active(self, language: str | None = None) -> list[ExerciseActivity]:
        stmt = select(ExerciseActivity).where(ExerciseActivity.is_active == True)
        if language:
            stmt = stmt.where(or_(ExerciseActivity.language == language, ExerciseActivity.language == "English"))
        return list(self.db.scalars(stmt).all())

    def mark_completed(self, senior_id: int, activity_id: int, completed_on: date) -> ExerciseCompletion:
        completion = ExerciseCompletion(senior_id=senior_id, activity_id=activity_id, completed_on=completed_on)
        self.db.add(completion)
        self.db.commit()
        self.db.refresh(completion)
        return completion
