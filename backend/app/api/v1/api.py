from fastapi import APIRouter
from app.api.v1.routers import auth, seniors, exercises, prayers, medicines, checkins, emergency, care_requests

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(seniors.router, prefix="/seniors", tags=["Senior Profiles"])
api_router.include_router(exercises.router, prefix="/exercises", tags=["Exercises"])
api_router.include_router(prayers.router, prefix="/prayers", tags=["Prayer Support"])
api_router.include_router(medicines.router, prefix="/medicines", tags=["Medicine Reminders"])
api_router.include_router(checkins.router, prefix="/checkins", tags=["Daily Check-ins"])
api_router.include_router(emergency.router, prefix="/emergency", tags=["Emergency SOS"])
api_router.include_router(care_requests.router, prefix="/care-requests", tags=["Doctor/Home Care Requests"])
