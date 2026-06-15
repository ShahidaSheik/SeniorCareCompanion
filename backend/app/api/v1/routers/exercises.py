from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.exercise import CompletionCreate, ExerciseCreate, ExerciseOut, ExerciseUpdate
from app.services.exercise_service import ExerciseService
from app.services.user_context import get_current_user, require_admin

router = APIRouter()


@router.post("", response_model=ExerciseOut)
def create_activity(data: ExerciseCreate, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return ExerciseService(db).create_activity(data)


@router.get("", response_model=list[ExerciseOut])
def list_activities(language: str | None = Query(default=None), db: Session = Depends(get_db)):
    return ExerciseService(db).list_active(language)


@router.get("/admin", response_model=list[ExerciseOut])
def list_activities_admin(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return ExerciseService(db).list_all()


@router.get("/my", response_model=list[ExerciseOut])
def list_my_exercises(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return ExerciseService(db).list_active(current_user.preferred_language or "English")


@router.put("/{activity_id}", response_model=ExerciseOut)
def update_activity(activity_id: int, data: ExerciseUpdate, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return ExerciseService(db).update_activity(activity_id, data)


@router.delete("/{activity_id}")
def delete_activity(activity_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return ExerciseService(db).deactivate_activity(activity_id)


@router.post("/complete")
def complete_activity(data: CompletionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    completion = ExerciseService(db).complete(current_user.id, data)
    return {"message": "Exercise marked as completed", "completion_id": completion.id}
