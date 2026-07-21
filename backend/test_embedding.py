from app.services.embeddings import create_embeddings

chunks = [
    "Hello World",
    "RAG Study Assistant",
    "Artificial Intelligence"
]

vectors = create_embeddings(chunks)

print("Number of vectors:", len(vectors))
print("Dimension:", len(vectors[0]))