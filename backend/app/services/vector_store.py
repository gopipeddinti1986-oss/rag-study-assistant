"""
Sprint 7 — Updated vector_store.py
Added: list_user_documents() and delete_document_chunks()
Everything else is unchanged from your Sprint 6 version.
"""

import chromadb
from datetime import datetime

# Create persistent database
client = chromadb.PersistentClient(path="database")


def get_user_collection(user_email: str):
    """
    Create or load a ChromaDB collection for a specific user.
    """
    collection_name = (
        user_email
        .replace("@", "_")
        .replace(".", "_")
    )

    return client.get_or_create_collection(name=collection_name)


def store_chunks(chunks, embeddings, filename, pages, user_email):
    """
    Store chunks in the user's personal collection.
    Adds uploaded_at timestamp to metadata.
    """
    collection = get_user_collection(user_email)

    uploaded_at = datetime.utcnow().isoformat()

    ids = [f"{filename}_{i}" for i in range(len(chunks))]

    metadata = [
        {
            "filename": filename,
            "page": page,
            "uploaded_at": uploaded_at,
        }
        for page in pages
    ]

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadata,
    )

    return len(chunks)


def get_all_chunks(user_email):
    """
    Return all stored chunks for the logged-in user.
    """
    collection = get_user_collection(user_email)
    results = collection.get()
    return results["documents"]


# ─── Sprint 7: New functions ──────────────────────────────────

def list_user_documents(user_email: str) -> list[dict]:
    """
    Return a deduplicated list of documents uploaded by the user.
    Each entry: { filename, chunk_count, uploaded_at }
    """
    collection = get_user_collection(user_email)
    results = collection.get(include=["metadatas"])
    metadatas = results.get("metadatas", [])

    seen: dict[str, dict] = {}

    for meta in metadatas:
        fn = meta.get("filename", "unknown")
        if fn not in seen:
            seen[fn] = {
                "filename": fn,
                "uploaded_at": meta.get("uploaded_at", "—"),
                "chunk_count": 0,
            }
        seen[fn]["chunk_count"] += 1

    return list(seen.values())


def delete_document_chunks(user_email: str, filename: str) -> int:
    """
    Delete all chunks for a given filename from the user's collection.
    Returns the number of chunks deleted.
    """
    collection = get_user_collection(user_email)

    results = collection.get(
        where={"filename": filename},
        include=["metadatas"],
    )

    ids = results.get("ids", [])

    if not ids:
        return 0

    collection.delete(ids=ids)
    return len(ids)
