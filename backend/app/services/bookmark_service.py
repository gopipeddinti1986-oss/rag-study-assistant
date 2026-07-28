from sqlalchemy.orm import Session

from app.database.models import Bookmark


def create_bookmark(
    db: Session,
    user_email: str,
    conversation_id: str,
    question: str,
    answer: str,
):
    existing = (
        db.query(Bookmark)
        .filter(
            Bookmark.user_email == user_email,
            Bookmark.conversation_id == conversation_id,
            Bookmark.question == question,
        )
        .first()
    )

    if existing:
        return existing

    bookmark = Bookmark(
        user_email=user_email,
        conversation_id=conversation_id,
        question=question,
        answer=answer,
    )

    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)

    return bookmark


def get_bookmarks(db: Session, user_email: str):
    return (
        db.query(Bookmark)
        .filter(Bookmark.user_email == user_email)
        .order_by(Bookmark.created_at.desc())
        .all()
    )


def delete_bookmark(db: Session, bookmark_id: int, user_email: str):
    bookmark = (
        db.query(Bookmark)
        .filter(
            Bookmark.id == bookmark_id,
            Bookmark.user_email == user_email,
        )
        .first()
    )

    if not bookmark:
        return {"message": "Bookmark not found"}

    db.delete(bookmark)
    db.commit()

    return {"message": "Bookmark deleted successfully"}