from datetime import date
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.exercise import ExerciseActivity, ExerciseCompletion
from app.repositories.base import BaseRepository


class ExerciseRepository(BaseRepository[ExerciseActivity]):
    def __init__(self, db: Session):
        super().__init__(ExerciseActivity, db)

    def list_active(self) -> list[ExerciseActivity]:
        return list(self.db.scalars(select(ExerciseActivity).where(ExerciseActivity.is_active == True)).all())

    def mark_completed(self, senior_id: int, activity_id: int, completed_on: date) -> ExerciseCompletion:
        completion = ExerciseCompletion(senior_id=senior_id, activity_id=activity_id, completed_on=completed_on)
        self.db.add(completion)
        self.db.commit()
        self.db.refresh(completion)
        return completion
