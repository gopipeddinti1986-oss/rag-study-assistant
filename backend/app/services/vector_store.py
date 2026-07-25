import chromadb

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

    return client.get_or_create_collection(
        name=collection_name
    )


def store_chunks(
    chunks,
    embeddings,
    filename,
    pages,
    user_email
):
    """
    Store chunks in the user's personal collection.
    """

    collection = get_user_collection(user_email)

    ids = [
        f"{filename}_{i}"
        for i in range(len(chunks))
    ]

    metadata = []

    for page in pages:
        metadata.append({
            "filename": filename,
            "page": page
        })

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings.tolist(),
        metadatas=metadata
    )

    return len(chunks)