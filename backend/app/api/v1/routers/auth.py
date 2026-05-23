from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.auth import LoginRequest, TokenResponse, UserCreate, UserOut
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/register", response_model=UserOut)
def register(data: UserCreate, db: Session = Depends(get_db)):
    # Router delegates business logic to service. No SQL query here.
    return AuthService(db).register(data)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    token, user = AuthService(db).login(data.email, data.password)
    return TokenResponse(access_token=token, user=user)
