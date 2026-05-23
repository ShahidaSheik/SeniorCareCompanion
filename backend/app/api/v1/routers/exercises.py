from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.exercise import CompletionCreate, ExerciseCreate, ExerciseOut
from app.services.exercise_service import ExerciseService
from app.services.user_context import get_current_user

router = APIRouter()


@router.post("", response_model=ExerciseOut)
def create_activity(data: ExerciseCreate, db: Session = Depends(get_db)):
    return ExerciseService(db).create_activity(data)


@router.get("", response_model=list[ExerciseOut])
def list_activities(db: Session = Depends(get_db)):
    return ExerciseService(db).list_active()


@router.post("/complete")
def complete_activity(data: CompletionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    completion = ExerciseService(db).complete(current_user.id, data)
    return {"message": "Exercise marked as completed", "completion_id": completion.id}
