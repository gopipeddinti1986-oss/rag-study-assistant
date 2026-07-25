# Sprint 6 - Authentication & Multi-User Support

## Sprint Goal

Transform the RAG Study Assistant into a secure multi-user application where every user has:

- Their own account
- Their own uploaded PDFs
- Their own ChromaDB collection
- Their own chat history

---

# Features Implemented

## 1. User Authentication

- User Signup
- User Login
- Password hashing using bcrypt
- JWT Authentication
- Protected API routes

---

## 2. User Database

Created a Users table with:

- id
- name
- email
- hashed_password
- created_at

SQLite was used as the database.

---

## 3. JWT Security

Implemented:

- Access Token Generation
- Token Validation
- Current User Authentication
- Protected Endpoints

Only authenticated users can:

- Upload PDFs
- Ask Questions
- View their own data

---

## 4. Multi-User ChromaDB

Instead of one shared vector database, every user now has their own ChromaDB collection.

Collection name is generated using the user's email.

Example:

```
gopi@gmail.com
↓

gopi_gmail_com
```

This prevents users from accessing each other's documents.

---

## 5. User-Specific PDF Upload

Uploaded PDFs are converted into embeddings and stored inside the logged-in user's ChromaDB collection.

Workflow:

Login
↓

Upload PDF
↓

Split Text
↓

Generate Embeddings
↓

Store in User Collection

---

## 6. User-Specific Retrieval

When asking questions:

- JWT identifies the logged-in user.
- Only that user's ChromaDB collection is searched.
- Answers are generated only from the user's uploaded documents.

---

## 7. Chat History

Every question and AI response is saved into SQLite.

Stored information:

- User Email
- Question
- AI Answer
- Timestamp

Users can only access their own chat history.

---

## 8. React Authentication

Frontend includes:

- Signup Page
- Login Page
- Protected Dashboard
- JWT Storage
- Logout Functionality

---

# API Endpoints

## Authentication

POST /auth/signup

POST /auth/login

---

## Protected

POST /upload

POST /ask

GET /

---

# Technologies Used

Backend

- FastAPI
- SQLAlchemy
- JWT
- bcrypt
- SQLite
- ChromaDB
- Sentence Transformers
- PyMuPDF

Frontend

- React
- Vite
- Axios
- Tailwind CSS

---

# Challenges Faced

- Configuring JWT Authentication
- Protecting FastAPI Routes
- Managing User Sessions
- Creating User-Specific ChromaDB Collections
- Fixing SQLAlchemy Model Mismatches
- Synchronizing Database Schema
- Saving Chat History Correctly

---

# What I Learned

- JWT Authentication
- Password Hashing
- SQLAlchemy ORM
- FastAPI Dependency Injection
- Route Protection
- Multi-User Database Design
- Vector Database Isolation
- User-Specific Retrieval
- React Authentication Flow

---

# Sprint Outcome

Successfully transformed the application into a secure multi-user RAG system.

Each user can:

✅ Register

✅ Login

✅ Upload PDFs

✅ Ask Questions

✅ Retrieve Answers

✅ View Their Own Chat History

without accessing another user's data.

---

# Next Sprint

Sprint 7

- Chat History Sidebar
- My Documents Page
- Delete Uploaded PDFs
- Streaming AI Responses
- Better UI/UX
- Source Preview
- User Profile