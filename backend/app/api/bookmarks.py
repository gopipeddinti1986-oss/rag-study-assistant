from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.auth.jwt import get_current_user
from app.schemas.bookmark import BookmarkCreate
from app.services.bookmark_service import (
    create_bookmark,
    get_bookmarks,
    delete_bookmark,
)

router = APIRouter(
    prefix="/bookmarks",
    tags=["Bookmarks"],
)


@router.post("/")
def add_bookmark(
    bookmark: BookmarkCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_bookmark(
        db,
        current_user.email,
        bookmark.conversation_id,
        bookmark.question,
        bookmark.answer,
    )


@router.get("/")
def list_bookmarks(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_bookmarks(
        db,
        current_user.email,
    )


@router.delete("/{bookmark_id}")
def remove_bookmark(
    bookmark_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return delete_bookmark(
        db,
        bookmark_id,
        current_user.email,
    )