from app.services.retriever import retrieve


def semantic_search(user_email: str, query: str):
    results = retrieve(
        query=query,
        user_email=user_email,
        k=10
    )

    return results