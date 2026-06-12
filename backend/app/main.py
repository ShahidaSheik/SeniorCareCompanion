from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.database import Base, engine
from app import models  # noqa: F401 - import models before create_all


def create_app() -> FastAPI:
    app = FastAPI(title=settings.APP_NAME)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Uploaded prayer audio/exercise video is served from /media/<filename>.
    app.mount("/media", StaticFiles(directory="media"), name="media")
    app.include_router(api_router, prefix="/api/v1")

    """ @app.on_event("startup")
    def on_startup() -> None:
        # Good for learning/demo. For real projects use Alembic migrations.
        Base.metadata.create_all(bind=engine)"""

    return app


app = create_app()
