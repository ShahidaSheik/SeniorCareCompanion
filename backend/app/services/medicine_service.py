from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from datetime import date

from app.models.user import User, UserRole
from app.models.medicine import MedicineReminder, MedicineLog
from app.repositories.medicine_repository import MedicineRepository
from app.repositories.caregiver_assignment_repository import CaregiverAssignmentRepository
from app.schemas.medicine import MedicineCreate, MedicineUpdate, MedicineLogCreate


class MedicineService:
    def __init__(self, db: Session):
        self.repo = MedicineRepository(db)
        self.assignment_repo = CaregiverAssignmentRepository(db)

    def create_medicine(self, data: MedicineCreate, current_user: User):
        if current_user.role != UserRole.CAREGIVER:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only caregivers can add medicine prescriptions",
            )

        is_assigned = self.assignment_repo.is_senior_assigned_to_caregiver(
            senior_id=data.senior_id,
            caregiver_id=current_user.id,
        )

        if not is_assigned:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This senior is not assigned to this caregiver",
            )

        medicine = MedicineReminder(
            senior_id=data.senior_id,
            caregiver_id=current_user.id,
            medicine_name=data.medicine_name,
            dosage=data.dosage,
            morning=data.morning,
            afternoon=data.afternoon,
            night=data.night,
            frequency=data.frequency,
            start_date=data.start_date,
            end_date=data.end_date,
            prescribed_by=data.prescribed_by,
            notes=data.notes,
            instructions=data.instructions,
        )

        return self.repo.create(medicine)

    def list_my_medicines(self, current_user: User):
        if current_user.role == UserRole.SENIOR:
            return self.repo.list_by_senior(current_user.id)

        if current_user.role == UserRole.CAREGIVER:
            return self.repo.list_by_caregiver(current_user.id)

        raise HTTPException(status_code=403, detail="Not allowed")

    def update_medicine(self, medicine_id: int, data: MedicineUpdate, current_user: User):
        medicine = self.repo.get_by_id(medicine_id)

        if not medicine:
            raise HTTPException(status_code=404, detail="Medicine not found")

        if current_user.role != UserRole.CAREGIVER:
            raise HTTPException(status_code=403, detail="Only caregiver can update medicine")

        if medicine.caregiver_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not your medicine record")

        update_data = data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(medicine, key, value)

        return self.repo.update(medicine)

    def mark_taken(self, medicine_id: int, current_user: User):
        medicine = self.repo.get_by_id(medicine_id)

        if not medicine:
            raise HTTPException(status_code=404, detail="Medicine not found")

        if current_user.role != UserRole.SENIOR:
            raise HTTPException(
                status_code=403,
                detail="Only senior can mark medicine as taken",
            )

        if medicine.senior_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="This medicine is not assigned to you",
            )

        log = MedicineLog(
            reminder_id=medicine.id,
            senior_id=current_user.id,
            taken_on=date.today(),
            is_taken=True,
        )

        return self.repo.create_log(log)

    def my_history(self, current_user: User):
        if current_user.role != UserRole.SENIOR:
            raise HTTPException(status_code=403, detail="Only senior can view own history")

        return self.repo.list_logs_by_senior(current_user.id)