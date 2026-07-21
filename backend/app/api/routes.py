from fastapi import APIRouter, UploadFile, File
from pathlib import Path
from app.services.text_splitter import split_text
from app.services.embeddings import create_embeddings
from app.services.vector_store import store_chunks
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

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Open PDF
    doc = fitz.open(file_path)

    # Count pages
    page_count = len(doc)

    # Extract text
    text = ""
    for page in doc:
        text += page.get_text()

    # Close PDF
    doc.close()

    # Split text into chunks
    chunks = split_text(text)
    embeddings = create_embeddings(chunks)
    stored_chunks = store_chunks(chunks, embeddings)

    # Count characters
    character_count = len(text)

    # Return response
    return {
    "message": "File uploaded successfully",
    "filename": file.filename,
    "pages": page_count,
    "characters": len(text),
    "chunks": len(chunks),
    "stored_chunks": stored_chunks,
    "saved_to": str(file_path)
    }