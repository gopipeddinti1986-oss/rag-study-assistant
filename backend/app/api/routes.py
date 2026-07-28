from pathlib import Path
import shutil
import uuid

import fitz
from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import ChatHistory, User
from app.auth.jwt import get_current_user

from app.models.ask import AskRequest

from app.services.ocr import extract_text
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

    ext = file_path.suffix.lower()
    page_count = 1

    if ext == ".pdf":
        try:
            doc = fitz.open(file_path)
            page_count = len(doc)
            doc.close()
        except Exception:
            page_count = 1

    text = extract_text(str(file_path))

    if not text.strip():
        return {
            "message": f"No text could be extracted from {file.filename}."
        }

    chunks = split_text(text)
    embeddings = create_embeddings(chunks)

    pages = []
    for i in range(len(chunks)):
        pages.append(min(i + 1, page_count))

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

    chat = save_chat(
        db=db,
        user_email=current_user.email,
        question=request.question,
        answer=answer,
        conversation_id=request.conversation_id
    )

    return {
        "conversation_id": chat.conversation_id,
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

@router.get("/conversations")
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chats = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_email == current_user.email)
        .order_by(desc(ChatHistory.created_at))
        .all()
    )

    conversations = {}

    for chat in chats:
        if chat.conversation_id not in conversations:
            conversations[chat.conversation_id] = {
                "conversation_id": chat.conversation_id,
                "title": chat.title,
                "created_at": chat.created_at
            }

    return list(conversations.values())


@router.get("/conversations/{conversation_id}")
def get_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chats = (
        db.query(ChatHistory)
        .filter(
            ChatHistory.user_email == current_user.email,
            ChatHistory.conversation_id == conversation_id,
            ChatHistory.question != ""
        )
        .order_by(desc(ChatHistory.created_at))
        .all()
    )

    return [
        {
            "question": chat.question,
            "answer": chat.answer,
            "created_at": chat.created_at
        }
        for chat in chats
    ]


@router.delete("/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chats = (
        db.query(ChatHistory)
        .filter(
            ChatHistory.user_email == current_user.email,
            ChatHistory.conversation_id == conversation_id
        )
        .all()
    )

    for chat in chats:
        db.delete(chat)

    db.commit()

    return {
        "message": "Conversation deleted successfully"
    }


@router.post("/conversations/new")
def create_new_conversation(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversation_id = str(uuid.uuid4())

    chat = ChatHistory(
        user_email=current_user.email,
        conversation_id=conversation_id,
        title="New Chat",
        question="",
        answer=""
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return {
        "conversation_id": conversation_id,
        "title": "New Chat"
    }