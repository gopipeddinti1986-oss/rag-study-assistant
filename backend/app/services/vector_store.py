import chromadb

# Create persistent database
client = chromadb.PersistentClient(path="database")

# Create (or load) collection
collection = client.get_or_create_collection(
    name="rag_documents"
)


def store_chunks(chunks, embeddings, filename, pages):
    """
    Store chunks, embeddings, and metadata in ChromaDB.
    """

    ids = [str(i) for i in range(len(chunks))]

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