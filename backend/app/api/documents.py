"""
Sprint 7 — Document Management API
Endpoints:
  GET  /documents         → list all documents uploaded by current user
  DELETE /documents/{filename} → delete a document and its vectors
"""

from fastapi import APIRouter, Depends, HTTPException

from app.auth.jwt import get_current_user
from app.database.models import User
from app.services.vector_store import (
    get_user_collection,
    delete_document_chunks,
    list_user_documents,
)

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


@router.get("/")
def list_documents(
    current_user: User = Depends(get_current_user),
):
    """
    Return all documents the current user has uploaded,
    with filename, page count, and chunk count.
    """
    docs = list_user_documents(current_user.email)
    return {"documents": docs}


@router.delete("/{filename}")
def delete_document(
    filename: str,
    current_user: User = Depends(get_current_user),
):
    """
    Delete all vectors for a specific document from ChromaDB.
    """
    deleted = delete_document_chunks(current_user.email, filename)

    if deleted == 0:
        raise HTTPException(
            status_code=404,
            detail=f"Document '{filename}' not found."
        )

    return {
        "message": f"'{filename}' deleted successfully.",
        "chunks_removed": deleted,
    }
