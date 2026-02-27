"""
Embedding generation — supports OpenAI (fast) or local HuggingFace fallback.
Embedder is initialized eagerly at import time to eliminate cold-start latency.
"""
from typing import List
from core.config import get_settings

settings = get_settings()
_embedder = None


def _init_embedder():
    global _embedder
    if settings.openai_api_key and settings.embedding_model == "openai":
        from langchain_openai import OpenAIEmbeddings
        _embedder = OpenAIEmbeddings(
            model="text-embedding-3-small",
            openai_api_key=settings.openai_api_key,
        )
    else:
        # Only import sentence-transformers if actually needed
        from langchain_community.embeddings import HuggingFaceEmbeddings
        _embedder = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )


# Initialize immediately — eliminates cold-start on first request
_init_embedder()


def get_embedder():
    return _embedder


def embed_texts(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for a batch of texts."""
    return _embedder.embed_documents(texts)


def embed_query(query: str) -> List[float]:
    """Generate embedding for a single query string."""
    return _embedder.embed_query(query)
