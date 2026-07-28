# RAG Study Assistant — Comprehensive Project Retrospective

## Executive Summary

The **RAG Study Assistant** was built over 7 intense development sprints to transform a basic PDF text extractor into an enterprise-ready, multi-user Retrieval-Augmented Generation (RAG) platform with modern UI/UX design.

---

## Sprint-by-Sprint Summary

| Sprint | Focus Area | Deliverable Highlights |
| :--- | :--- | :--- |
| **Sprint 1** | PDF Upload Service | FastAPI backend with PyMuPDF text extraction. |
| **Sprint 2** | Text Chunking | Reusable text splitter service generating 500-character chunks with page attribution. |
| **Sprint 3** | Vector Embeddings & Storage | `sentence-transformers/all-MiniLM-L6-v2` embeddings and ChromaDB vector retriever. |
| **Sprint 4** | AI Chat MVP | Groq Llama-3.3-70B integration with grounded prompt engineering and page citations. |
| **Sprint 5** | React Frontend & Integration | Interactive two-panel layout, drag-and-drop file upload, dark mode toggle, and multi-format (PDF/DOCX/TXT) support. |
| **Sprint 6** | Auth & Multi-User Security | JWT token authentication, bcrypt password hashing, SQLite relational store, and user-isolated ChromaDB collections. |
| **Sprint 7** | Advanced Features & UI Polish | Tesseract OCR fallback, Web Speech API voice input, 3D interactive flashcards, topic MCQ quiz generator, visual Mind Map generator, Google-style semantic search engine, and Admin system diagnostics. |

---

## 1. What Went Well?

- **Vector Database Isolation**: Deriving ChromaDB collection names dynamically from sanitized user emails (`user_email.replace('@', '_').replace('.', '_')`) provided total data isolation for multi-tenant privacy.
- **Glassmorphic UI & UX System**: Modern layout featuring Tailwind v4 CSS variables, dark/light mode persistence via `localStorage`, Lucide icon sets, smooth 3D flip card transforms, and responsive sidebar navigation.
- **Voice Dictation**: Web Speech API integration (`useVoiceInput` hook) allowing hands-free voice input across Chat, Search, and Quiz topic fields.
- **Visual Mind Mapping**: Automated hierarchical tree breakdown giving students an interactive visual sitemap of their uploaded document chapters.
- **Robust Multi-Format Parsing**: Flexible text extraction supporting `.pdf`, `.docx`, and `.txt` files with lazy Tesseract OCR fallback for scanned images.

---

## 2. What Was Hard?

- **ChromaDB Metadata Queries**: Filtering vector chunks accurately required strict metadata shape matching (`filename` and `user_email`).
- **Tailwind v4 Dark Mode Integration**: Adapting to Tailwind v4 `@custom-variant dark (&:where(.dark, .dark *));` required explicit scoping instead of legacy configuration objects.
- **React 3D Flip Animations**: Ensuring smooth 3D card flips required configuring `perspective-1000`, `transform-style-3d`, and `backface-visibility: hidden` cross-browser.

---

## 3. Key Learnings & Engineering Takeaways

- **Decoupled Architecture**: Keeping API routes (`routes.py`, `documents.py`, `quiz.py`, `mindmap.py`, `admin.py`) cleanly separated from underlying domain services (`ocr.py`, `vector_store.py`, `llm.py`) allowed feature expansion with zero breaking changes.
- **User-Centric AI Feedback**: Providing grounded source citations (filename + page number) and copy/bookmark capabilities greatly increases trust in AI answers.
- **Graceful Fallbacks**: Implementing safe fallbacks across OCR, Groq LLM API limits, and Web Speech API ensured the application remains functional regardless of environment variations.

---

## 4. How to Run & Verify

1. **Backend**:
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser. Register an account and upload your study materials!
