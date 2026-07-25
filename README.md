# 📚 RAG Study Assistant

An AI-powered Retrieval-Augmented Generation (RAG) Study Assistant that allows users to upload PDFs and ask questions using Large Language Models.

Each user has their own account, documents, vector database, and chat history.

---

# Features

- User Authentication
- JWT Authorization
- Secure Password Hashing
- Multi-User Support
- PDF Upload
- Text Extraction
- Automatic Text Chunking
- Sentence Transformer Embeddings
- ChromaDB Vector Storage
- Semantic Search
- AI Question Answering
- User-Specific Chat History
- React Frontend
- FastAPI Backend

---

# Project Architecture

```
Frontend (React + Vite)
        │
        ▼
FastAPI Backend
        │
        ├── Authentication
        │
        ├── PDF Upload
        │
        ├── Text Splitter
        │
        ├── Embeddings
        │
        ├── ChromaDB
        │
        ├── Retriever
        │
        ├── LLM
        │
        └── SQLite
```

---

# Tech Stack

## Frontend

- React
- Vite
- Axios
- Tailwind CSS

## Backend

- FastAPI
- SQLAlchemy
- JWT
- bcrypt
- SQLite

## AI

- Sentence Transformers
- ChromaDB
- HuggingFace
- PyMuPDF

---

# Authentication Flow

```
Signup
   ↓

Login
   ↓

JWT Token
   ↓

Protected Routes
   ↓

Upload PDF
   ↓

Ask Questions
```

---

# RAG Workflow

```
Upload PDF
      ↓

Extract Text
      ↓

Split Into Chunks
      ↓

Generate Embeddings
      ↓

Store in ChromaDB
      ↓

User Question
      ↓

Semantic Search
      ↓

LLM
      ↓

Answer
```

---

# Multi-User Architecture

Each user has:

- Individual Login
- Individual ChromaDB Collection
- Individual Chat History
- Individual Uploaded PDFs

No user can access another user's data.

---

# API Endpoints

## Authentication

### Signup

POST /auth/signup

### Login

POST /auth/login

---

## Protected APIs

### Upload PDF

POST /upload

### Ask Question

POST /ask

---

# Project Structure

```
backend/
│
├── app/
│   ├── api/
│   ├── auth/
│   ├── database/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   ├── config.py
│   └── main.py
│
├── database/
│
├── uploads/
│
└── requirements.txt

frontend/
│
├── src/
│
├── public/
│
└── package.json
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd rag-study-assistant
```

---

## Backend

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Future Improvements

- Chat Sidebar
- Conversation History
- Delete Documents
- Document Management
- Streaming Responses
- Citation Highlighting
- Dark Mode
- PostgreSQL Migration
- Docker Support
- Deployment
- Admin Dashboard

---

# Sprint Progress

- ✅ Sprint 1 — PDF Upload
- ✅ Sprint 2 — Text Processing
- ✅ Sprint 3 — Embeddings & ChromaDB
- ✅ Sprint 4 — Retrieval & AI Responses
- ✅ Sprint 5 — React Frontend
- ✅ Sprint 6 — Authentication & Multi-User Support
- ⏳ Sprint 7 — Chat Management & UI Enhancements

---

# Author

**Gopi**

AI & Machine Learning Student

Aditya University

---

# License

This project is intended for educational and portfolio purposes.