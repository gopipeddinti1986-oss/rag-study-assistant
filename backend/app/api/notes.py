from fastapi import APIRouter, Depends

from app.auth.jwt import get_current_user
from app.database.models import User
from app.models.notes import NotesRequest
from app.services.notes_service import generate_notes

router = APIRouter(
    prefix="/notes",
    tags=["Notes"],
)


@router.post("/")
def create_notes(
    request: NotesRequest,
    current_user: User = Depends(get_current_user),
):
    notes = generate_notes(
        current_user.email,
    )

    return {
        "notes": notes
    }