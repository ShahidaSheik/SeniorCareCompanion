from sqlalchemy.orm import Session
from app.repositories.exercise_repository import ExerciseRepository
from app.schemas.exercise import ExerciseCreate, CompletionCreate
from app.models.exercise import ExerciseActivity, ExerciseCompletion


class ExerciseService:
    def __init__(self, db: Session):
        self.repo = ExerciseRepository(db)

    def create_activity(self, data: ExerciseCreate) -> ExerciseActivity:
        return self.repo.add(ExerciseActivity(**data.model_dump()))

    def list_active(self, language: str | None = None) -> list[ExerciseActivity]:
        return self.repo.list_active(language)

    def complete(self, senior_id: int, data: CompletionCreate) -> ExerciseCompletion:
        return self.repo.mark_completed(senior_id, data.activity_id, data.completed_on)
