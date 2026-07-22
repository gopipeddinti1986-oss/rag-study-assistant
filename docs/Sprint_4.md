# Sprint 4 – AI Chat MVP

## Goal
Build a complete RAG pipeline that answers questions using uploaded PDFs.

## Features Completed

- Connected ChromaDB retriever
- Connected Groq Llama-3.3-70B
- Added POST /ask endpoint
- Retrieved top relevant chunks
- Generated context-aware answers
- Returned filename and page citations
- Tested using Swagger UI

## Technologies

- FastAPI
- ChromaDB
- Sentence Transformers
- Groq API
- Python

## Testing

Question:
What is software engineering?

Result:
Returned an AI-generated answer with page citations from the uploaded PDF.

## Challenges

- Collection not found error
- Metadata NoneType error
- ChromaDB collection mismatch

## Solutions

- Used get_or_create_collection()
- Stored metadata with every chunk
- Re-uploaded PDF after metadata update

## Outcome

Successfully built the first complete Retrieval-Augmented Generation (RAG) pipeline.