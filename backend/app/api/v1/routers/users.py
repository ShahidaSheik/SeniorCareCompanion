from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User, UserRole
from app.schemas.auth import UserOut
from app.schemas.user import UserUpdate
from app.services.user_context import require_admin

router = APIRouter()


@router.get("", response_model=list[UserOut])
def list_users(
    role: UserRole | None = Query(default=None),
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Admin can list seniors/caregivers to create assignments."""
    stmt = select(User).where(User.is_active == True).order_by(User.full_name)
    if role:
        stmt = stmt.where(User.role == role)
    return list(db.scalars(stmt).all())

@router.put("/{user_id}", response_model=UserOut)
def update_user(user_id: int, data: UserUpdate, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}")
def deactivate_user(user_id: int, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    db.commit()
    return {"message": "User deactivated", "id": user_id}
