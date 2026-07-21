from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer

client = PersistentClient(path="database")
collection = client.get_collection("rag_documents")

model = SentenceTransformer("all-MiniLM-L6-v2")


def retrieve(query: str, top_k: int = 5):
    query_embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    return results["documents"][0]