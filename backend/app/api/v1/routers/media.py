from pathlib import Path
from uuid import uuid4
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from app.models.user import User
from app.services.user_context import require_admin

router = APIRouter()

MEDIA_DIR = Path("media")
MEDIA_DIR.mkdir(exist_ok=True)
ALLOWED_EXTENSIONS = {".mp3", ".wav", ".m4a", ".mp4", ".mov", ".webm"}


@router.post("/upload")
async def upload_media(file: UploadFile = File(...), admin: User = Depends(require_admin)):
    """Admin uploads prayer audio or exercise audio/video.

    Returns a URL that can be saved in Prayer/Exercise forms.
    """
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only audio/video files are allowed")
    safe_name = f"{uuid4().hex}{suffix}"
    target = MEDIA_DIR / safe_name
    target.write_bytes(await file.read())
    return {"filename": safe_name, "url": f"/media/{safe_name}"}


@router.get("/download/{filename}")
def download_media(filename: str):
    target = MEDIA_DIR / filename
    if not target.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(target, filename=filename)
