from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from pathlib import Path
import fitz
import shutil

from app.database.database import get_db
from app.database.models import ChatHistory, User
from app.auth.jwt import get_current_user

from app.models.ask import AskRequest
from app.services.text_splitter import split_text
from app.services.embeddings import create_embeddings
from app.services.vector_store import store_chunks
from app.services.retriever import retrieve
from app.services.llm import ask_llm
from app.services.chat_service import save_chat

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.get("/")
def home():
    return {
        "message": "Welcome to RAG Study Assistant API"
    }


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    doc = fitz.open(file_path)

    page_count = len(doc)

    text = ""
    for page in doc:
        text += page.get_text()

    doc.close()

    chunks = split_text(text)
    embeddings = create_embeddings(chunks)

    pages = []

    for i in range(len(chunks)):
        pages.append(i + 1)

    stored_chunks = store_chunks(
        chunks,
        embeddings,
        file.filename,
        pages,
        current_user.email
    )

    return {
        "message": "File uploaded successfully",
        "filename": file.filename,
        "pages": page_count,
        "characters": len(text),
        "chunks": len(chunks),
        "stored_chunks": stored_chunks,
        "saved_to": str(file_path)
    }


@router.post("/ask")
def ask_question(
    request: AskRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chunks = retrieve(
        request.question,
        current_user.email
    )

    context = "\n\n".join(
        chunk["text"] for chunk in chunks
    )

    prompt = f"""
You are a helpful study assistant.

Answer ONLY using the context below.

Context:
{context}

Question:
{request.question}
"""

    answer = ask_llm(prompt)


    save_chat(
        db=db,
        user_email=current_user.email,
        question=request.question,
        answer=answer
    )

    return {
        "question": request.question,
        "answer": answer,
        "sources": [
            {
                "filename": chunk["filename"],
                "page": chunk["page"]
            }
            for chunk in chunks
        ]
    }