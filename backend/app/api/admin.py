from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.database.models import User, ChatHistory
from app.auth.jwt import get_current_user
from app.services.vector_store import list_user_documents, get_all_chunks

router = APIRouter(
    prefix="/admin",
    tags=["Admin & Stats"],
)


@router.get("/stats")
def get_system_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return comprehensive statistics for the current user and platform status.
    """
    # User specific docs and vector chunks
    user_docs = list_user_documents(current_user.email)
    user_chunks = get_all_chunks(current_user.email)
    total_user_docs = len(user_docs)
    total_user_chunks = len(user_chunks)

    # Chat metrics
    total_user_questions = (
        db.query(func.count(ChatHistory.id))
        .filter(ChatHistory.user_email == current_user.email, ChatHistory.question != "")
        .scalar() or 0
    )

    # Platform metrics
    total_registered_users = db.query(func.count(User.id)).scalar() or 0
    total_system_chats = db.query(func.count(ChatHistory.id)).scalar() or 0

    return {
        "user_email": current_user.email,
        "user_name": current_user.name,
        "stats": {
            "documents_count": total_user_docs,
            "vector_chunks_count": total_user_chunks,
            "questions_asked_count": total_user_questions,
            "total_users": total_registered_users,
            "total_chats_system": total_system_chats,
            "database_status": "Healthy",
            "chromadb_status": "Active"
        },
        "documents": user_docs
    }
