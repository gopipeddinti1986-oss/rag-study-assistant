from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.auth.jwt import get_current_user
from app.database.models import User
from app.services.mindmap_service import generate_mindmap

router = APIRouter(
    prefix="/mindmap",
    tags=["MindMap"],
)


class MindMapRequest(BaseModel):
    topic: Optional[str] = None


@router.post("/")
def get_mindmap(
    request: MindMapRequest = MindMapRequest(),
    current_user: User = Depends(get_current_user),
):
    map_data = generate_mindmap(current_user.email, request.topic)
    return {"mindmap": map_data}
