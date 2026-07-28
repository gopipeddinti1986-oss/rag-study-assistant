from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import bookmarks
from app.api.search import router as search_router
from app.api.routes import router
from app.api.auth import router as auth_router
from app.api.quiz import router as quiz_router
from app.api.flashcards import router as flashcards_router
from app.api.notes import router as notes_router
from app.api.documents import router as documents_router   # NEW Sprint 7
from app.api.mindmap import router as mindmap_router       # NEW Sprint 7
from app.api.admin import router as admin_router           # NEW Sprint 7

from app.database.database import engine
from app.database.models import Base

app = FastAPI(title="RAG Study Assistant")

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Existing routes
app.include_router(router)
app.include_router(auth_router)
app.include_router(quiz_router)
app.include_router(search_router)
app.include_router(notes_router)
app.include_router(flashcards_router)
app.include_router(bookmarks.router)

# Sprint 7 new routes
app.include_router(documents_router)
app.include_router(mindmap_router)
app.include_router(admin_router)

