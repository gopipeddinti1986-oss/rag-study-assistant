"""
Sprint 7 — Updated quiz.py
Added optional `topic` field to QuizRequest.
"""

from fastapi import APIRouter, Depends

from app.auth.jwt import get_current_user
from app.database.models import User
from app.models.quiz import QuizRequest
from app.services.quiz_service import generate_quiz

router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"],
)


@router.post("/")
def generate_quiz_api(
    request: QuizRequest,
    current_user: User = Depends(get_current_user),
):
    questions = generate_quiz(
        user_email=current_user.email,
        difficulty=request.difficulty,
        count=request.count,
        topic=request.topic,                    # Sprint 7: topic
    )

    return {"questions": questions}
