import chromadb

# Create persistent database
client = chromadb.PersistentClient(path="database")

# Create (or load) collection
collection = client.get_or_create_collection(
    name="study_notes"
)


def store_chunks(chunks, embeddings):
    """
    Store chunks and embeddings in ChromaDB.
    """

    ids = [str(i) for i in range(len(chunks))]

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings.tolist()
    )

    return len(chunks)