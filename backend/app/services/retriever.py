from app.services.vector_store import get_user_collection


def retrieve(
    query,
    user_email,
    k=25
):
    """
    Retrieve relevant chunks from the logged-in user's
    ChromaDB collection.
    """

    collection = get_user_collection(user_email)

    results = collection.query(
        query_texts=[query],
        n_results=k
    )

    retrieved = []

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]

    for doc, meta in zip(documents, metadatas):
        retrieved.append(
            {
                "text": doc,
                "filename": meta["filename"],
                "page": meta["page"]
            }
        )

    return retrieved