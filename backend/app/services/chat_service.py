import uuid
from sqlalchemy.orm import Session

from app.database.models import ChatHistory


def save_chat(
    db: Session,
    user_email: str,
    question: str,
    answer: str,
    conversation_id: str | None = None,
):
    # Create conversation if it doesn't exist
    if conversation_id is None:
        conversation_id = str(uuid.uuid4())

    # Find placeholder conversation
    placeholder = (
        db.query(ChatHistory)
        .filter(
            ChatHistory.conversation_id == conversation_id,
            ChatHistory.question == "",
            ChatHistory.answer == ""
        )
        .first()
    )

    # First message in this conversation
    if placeholder:

        placeholder.question = question
        placeholder.answer = answer

        # First question becomes title
        placeholder.title = (
            question[:50] + "..."
            if len(question) > 50
            else question
        )

        db.commit()
        db.refresh(placeholder)

        return placeholder

    # Existing conversation
    chat = ChatHistory(
        user_email=user_email,
        conversation_id=conversation_id,
        title="",
        question=question,
        answer=answer
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return chat