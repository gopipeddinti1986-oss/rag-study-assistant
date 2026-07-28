from pydantic import BaseModel
from datetime import datetime


class BookmarkCreate(BaseModel):
    conversation_id: str
    question: str
    answer: str


class BookmarkResponse(BaseModel):
    id: int
    user_email: str
    conversation_id: str
    question: str
    answer: str
    created_at: datetime

    class Config:
        from_attributes = True