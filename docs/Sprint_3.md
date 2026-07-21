# Sprint 3 - Embeddings & ChromaDB

## Objective

Convert extracted PDF text into searchable embeddings and store them inside ChromaDB.

---

## Tasks Completed

- Installed sentence-transformers
- Installed ChromaDB
- Generated embeddings using all-MiniLM-L6-v2
- Stored embeddings in ChromaDB
- Built retriever
- Retrieved top matching chunks

---

## Technologies

- sentence-transformers
- all-MiniLM-L6-v2
- ChromaDB
- FastAPI
- Python

---

## Testing

Successfully tested:

- Embedding generation
- ChromaDB storage
- Semantic retrieval

Query:
"What is software engineering?"

Retriever returned the most relevant chunks from the uploaded PDF.

---

## Challenges

- ChromaDB collection naming mismatch
- Import errors
- Database recreation

---

## Outcome

The project can now search uploaded documents semantically using vector embeddings.