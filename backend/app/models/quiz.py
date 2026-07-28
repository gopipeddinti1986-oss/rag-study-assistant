from typing import List
from pydantic import BaseModel


class QuizRequest(BaseModel):
    difficulty: str = "medium"
    count: int = 10
    topic: str = "Generate quiz questions"      # Sprint 7: topic focus


class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str
    explanation: str
