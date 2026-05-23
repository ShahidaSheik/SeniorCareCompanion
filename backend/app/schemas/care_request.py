from datetime import datetime
from pydantic import BaseModel
from app.schemas.base import ORMModel


class CareRequestCreate(BaseModel):
    request_type: str
    description: str
    preferred_time: datetime | None = None


class CareRequestOut(CareRequestCreate, ORMModel):
    id: int
    senior_id: int
    status: str
