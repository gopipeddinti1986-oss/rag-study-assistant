from app.services.embeddings import create_embeddings
from app.services.vector_store import store_chunks

chunks = [
    "Python is a programming language.",
    "FastAPI is used for backend.",
    "ChromaDB stores embeddings."
]

embeddings = create_embeddings(chunks)

count = store_chunks(chunks, embeddings)

print("Stored:", count)
