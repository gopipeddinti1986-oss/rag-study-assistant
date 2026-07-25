import uuid

from sqlalchemy.orm import Session

from app.database.models import ChatHistory


def save_chat(
    db: Session,
    user_email: str,
    question: str,
    answer: str,
    conversation_id: str | None = None,
    title: str | None = None
):
    # Create a new conversation ID if this is a new chat
    if conversation_id is None:
        conversation_id = str(uuid.uuid4())

    # Default title
    if title is None:
        title = question[:50]

    chat = ChatHistory(
        user_email=user_email,
        conversation_id=conversation_id,
        title=title,
        question=question,
        answer=answer
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return chat