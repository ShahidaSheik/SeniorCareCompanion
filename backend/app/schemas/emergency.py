from pydantic import BaseModel
from app.schemas.base import ORMModel


class EmergencyContactCreate(BaseModel):
    name: str
    relation: str
    phone: str
    is_primary: bool = False


class EmergencyContactOut(EmergencyContactCreate, ORMModel):
    id: int
    senior_id: int


class SOSCreate(BaseModel):
    message: str = "Emergency help needed"
    latitude: float | None = None
    longitude: float | None = None


class SOSOut(ORMModel):
    id: int
    senior_id: int
    message: str
    latitude: float | None
    longitude: float | None
    status: str
