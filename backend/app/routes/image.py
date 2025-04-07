import os
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from uuid import uuid4

router = APIRouter()

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    contents = await file.read()

    # Generate unique filename
    ext = file.filename.split(".")[-1]
    filename = f"{uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    # Save to disk
    with open(filepath, "wb") as f:
        f.write(contents)

    return JSONResponse(content={
        "filename": filename,
        "filepath": filepath,
        "message": "Image uploaded successfully"
    })