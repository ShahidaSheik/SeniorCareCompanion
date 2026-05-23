from pydantic import BaseModel, ConfigDict


class ORMModel(BaseModel):
    """Allows Pydantic to serialize SQLAlchemy ORM objects."""
    model_config = ConfigDict(from_attributes=True)
