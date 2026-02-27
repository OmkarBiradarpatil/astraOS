"""
AstraOS AI Vault — FastAPI Application Entry Point
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from api.routes import vault, chat, search, graph, insights
from core.config import get_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup & shutdown events."""
    os.makedirs(settings.upload_dir, exist_ok=True)
    os.makedirs(settings.chroma_persist_dir, exist_ok=True)
    print("🚀 AstraOS AI Vault API started")
    print(f"📁 Upload dir: {settings.upload_dir}")
    print(f"🧠 Vector DB: {settings.chroma_persist_dir}")
    print(f"🤖 Embedding: {settings.embedding_model}")
    print(f"💬 LLM: {settings.llm_model}")
    yield
    print("✅ AstraOS API shutdown complete")


app = FastAPI(
    title="AstraOS AI Vault API",
    description="The AI-powered Second Brain — RAG-based knowledge management system",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
origins = [o.strip() for o in settings.allowed_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(vault.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(graph.router, prefix="/api")
app.include_router(insights.router, prefix="/api")


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "AstraOS AI Vault",
        "version": "1.0.0",
        "embedding_model": settings.embedding_model,
        "llm_model": settings.llm_model,
    }


@app.get("/")
async def root():
    return {
        "message": "Welcome to AstraOS AI Vault API",
        "docs": "/docs",
        "health": "/health",
    }
