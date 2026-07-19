from fastapi import APIRouter, UploadFile, File
from pathlib import Path
import fitz
import shutil

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.get("/")
def home():
    return {
        "message": "Welcome to RAG Study Assistant API"
    }


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    doc = fitz.open(file_path)

    page_count = len(doc)

    text = ""

    for page in doc:
        text += page.get_text()

    doc.close()

    character_count = len(text)

    return {
        "message": "File uploaded successfully",
        "filename": file.filename,
        "pages": page_count,
        "characters": character_count,
        "saved_to": str(file_path)
    }