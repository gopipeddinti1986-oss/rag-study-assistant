import json

from fastapi import APIRouter, Depends

from app.auth.jwt import get_current_user
from app.database.models import User
from app.models.flashcard import FlashcardRequest
from app.services.flashcard_service import generate_flashcards

router = APIRouter(
    prefix="/flashcards",
    tags=["Flashcards"],
)


@router.post("/")
def create_flashcards(
    request: FlashcardRequest,
    current_user: User = Depends(get_current_user),
):
    cards = generate_flashcards(
        request.count,
        current_user.email,
    )

    if isinstance(cards, str):
        try:
            cards = json.loads(cards)
        except Exception:
            cards = []

    return {"flashcards": cards}