from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.user_context import get_current_user
from app.models.user import User
from app.schemas.medicine import (
    MedicineCreate,
    MedicineUpdate,
    MedicineOut,
    MedicineLogCreate,
    MedicineLogOut,
)
from app.services.medicine_service import MedicineService

router = APIRouter(tags=["Medicines"])


@router.post("", response_model=MedicineOut)
def create_medicine(
    data: MedicineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return MedicineService(db).create_medicine(data, current_user)


@router.get("/my", response_model=list[MedicineOut])
def list_my_medicines(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return MedicineService(db).list_my_medicines(current_user)


@router.put("/{medicine_id}", response_model=MedicineOut)
def update_medicine(
    medicine_id: int,
    data: MedicineUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return MedicineService(db).update_medicine(medicine_id, data, current_user)


@router.post("/{medicine_id}/mark-taken", response_model=MedicineLogOut)
def mark_taken(
    medicine_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return MedicineService(db).mark_taken(medicine_id, current_user)


@router.get("/history", response_model=list[MedicineLogOut])
def my_medicine_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return MedicineService(db).my_history(current_user)