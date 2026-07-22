import chromadb
from app.services.embeddings import create_embeddings

client = chromadb.PersistentClient(path="database")

collection = client.get_or_create_collection(
    name="rag_documents"
)


from app.services.vector_store import collection

def retrieve(query, k=5):
    results = collection.query(
        query_texts=[query],
        n_results=k
    )

    retrieved = []

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]

    for doc, meta in zip(documents, metadatas):
        retrieved.append({
            "text": doc,
            "filename": meta["filename"],
            "page": meta["page"]
        })

    return retrieved