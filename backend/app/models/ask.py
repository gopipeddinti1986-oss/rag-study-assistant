from pydantic import BaseModel
from typing import Optional

class AskRequest(BaseModel):
    question: str
    conversation_id: Optional[str] = None