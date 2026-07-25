from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.api.auth import router as auth_router

from app.database.database import engine
from app.database.models import Base

app = FastAPI(
    title="RAG Study Assistant"
)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Existing RAG routes
app.include_router(router)

# Authentication routes
app.include_router(auth_router)