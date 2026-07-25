from sqlalchemy.orm import Session

from app.database.models import ChatHistory


def save_chat(
    db: Session,
    user_email: str,
    question: str,
    answer: str
):
    chat = ChatHistory(
    user_email=user_email,
    question=question,
    answer=answer
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return chat