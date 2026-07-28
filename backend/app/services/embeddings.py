from sentence_transformers import SentenceTransformer

# Load embedding model once
model = SentenceTransformer("all-MiniLM-L6-v2")


def create_embeddings(chunks):
    """
    Create embeddings for a list of text chunks.
    """
    embeddings = model.encode(chunks)
    return embeddings.tolist()