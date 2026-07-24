from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(
    title="RAG Study Assistant"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)