from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.repositories.exercise_repository import ExerciseRepository
from app.schemas.exercise import ExerciseCreate, CompletionCreate, ExerciseUpdate
from app.models.exercise import ExerciseActivity, ExerciseCompletion


class ExerciseService:
    def __init__(self, db: Session):
        self.repo = ExerciseRepository(db)

    def create_activity(self, data: ExerciseCreate) -> ExerciseActivity:
        return self.repo.add(ExerciseActivity(**data.model_dump()))

    def list_active(self, language: str | None = None) -> list[ExerciseActivity]:
        return self.repo.list_active(language)

    def list_all(self) -> list[ExerciseActivity]:
        return self.repo.list_all_admin()

    def update_activity(self, activity_id: int, data: ExerciseUpdate) -> ExerciseActivity:
        activity = self.repo.get(activity_id)
        if not activity:
            raise HTTPException(status_code=404, detail="Exercise not found")
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(activity, key, value)
        self.repo.db.commit()
        self.repo.db.refresh(activity)
        return activity

    def deactivate_activity(self, activity_id: int) -> dict:
        self.update_activity(activity_id, ExerciseUpdate(is_active=False))
        return {"message": "Exercise deactivated", "id": activity_id}

    def complete(self, senior_id: int, data: CompletionCreate) -> ExerciseCompletion:
        return self.repo.mark_completed(senior_id, data.activity_id, data.completed_on)
