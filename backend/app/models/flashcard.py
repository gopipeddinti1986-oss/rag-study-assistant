from pydantic import BaseModel


class FlashcardRequest(BaseModel):
    count: int = 10