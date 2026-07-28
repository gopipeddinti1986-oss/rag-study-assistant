from fastapi import APIRouter, Depends

from app.auth.jwt import get_current_user
from app.database.models import User
from app.models.search import SearchRequest
from app.services.search_service import semantic_search

router = APIRouter(
    prefix="/search",
    tags=["Semantic Search"]
)

@router.post("/")
def search(
    request: SearchRequest,
    current_user: User = Depends(get_current_user)
):
    results = semantic_search(
        current_user.email,
        request.query
    )

    return {
        "results": results
    }