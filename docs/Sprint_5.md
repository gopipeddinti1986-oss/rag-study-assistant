# Sprint 5 – Frontend Integration & AI Chat

## Sprint Goal

Build a user-friendly frontend that allows users to:

- Upload PDF files
- Ask questions about uploaded documents
- Display AI-generated answers
- Show source citations
- Improve the overall user experience

---

## User Stories

- As a user, I want to upload a PDF document.
- As a user, I want to drag and drop my PDF.
- As a user, I want to ask questions about the uploaded PDF.
- As a user, I want to know which pages the AI used.
- As a user, I want visual feedback while the AI is generating an answer.

---

# Features Implemented

## PDF Upload

- Upload PDF from local computer
- Upload status message
- FastAPI integration

---

## Drag & Drop Upload

- Drag PDF into upload area
- Highlight upload box during drag
- Drop to select PDF

---

## Professional Upload UI

- Modern upload card
- Dynamic icons
- Change PDF button
- Upload button
- Success/Error messages

---

## AI Chat

- Ask questions about uploaded PDFs
- FastAPI backend communication
- Display AI-generated responses

---

## Source Citations

Each answer displays the source PDF and page numbers used by the AI.

Example:

```
Software Engineering.pdf (Page 12)
Software Engineering.pdf (Page 15)
```

---

## Loading Experience

Added:

- Loading spinner
- "AI is analyzing your document..." message
- Disabled Send button while processing
- Disabled input during response generation

---

# Technologies Used

## Frontend

- React
- Vite
- Tailwind CSS
- Axios

## Backend

- FastAPI
- LangChain
- ChromaDB
- Sentence Transformers
- Groq LLM

---

# API Endpoints

## Upload PDF

```
POST /upload
```

Uploads a PDF and stores embeddings.

---

## Ask Question

```
POST /ask
```

Request

```json
{
    "question": "What is Software Engineering?"
}
```

Response

```json
{
    "answer": "...",
    "sources": [
        {
            "filename": "SoftwareEngineering.pdf",
            "page": 12
        }
    ]
}
```

---

# Project Structure

```
frontend/
│
├── components/
│   ├── UploadPanel.jsx
│   └── ChatPanel.jsx
│
├── api/
│   └── api.js
│
└── App.jsx
```

---

# Testing

### Upload

- ✅ PDF selected
- ✅ Drag & Drop works
- ✅ Upload successful

### Chat

- ✅ Question sent
- ✅ AI response received
- ✅ Sources displayed
- ✅ Loading animation works

---

# Challenges

- React state management
- Connecting frontend with FastAPI
- Displaying source citations
- Implementing drag-and-drop upload
- Improving loading experience

---

# Outcome

Sprint 5 successfully delivers a complete frontend interface for the RAG Study Assistant.

Users can:

- Upload PDFs
- Ask AI questions
- View AI responses
- See source citations
- Enjoy a modern and responsive interface

---

# Sprint Review

## Completed

- PDF Upload
- Drag & Drop Upload
- Upload Status
- Professional Upload UI
- AI Chat
- Source Citations
- Loading Spinner
- Backend Integration

---

## Sprint Status

**Sprint 5 Completed Successfully**

Progress: **100%**

---

# Next Sprint

Sprint 6

Focus:

- Chat History
- Multiple PDF Support
- Better Source Display
- Improved UI
- Additional User Experience Enhancements