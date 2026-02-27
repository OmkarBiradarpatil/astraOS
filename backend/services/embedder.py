"""
Embedding generation — supports OpenAI or local HuggingFace fallback.
"""
from typing import List
from core.config import get_settings

settings = get_settings()

_embedder = None


def get_embedder():
    global _embedder
    if _embedder is not None:
        return _embedder

    if settings.embedding_model == "openai" and settings.openai_api_key:
        from langchain_openai import OpenAIEmbeddings
        _embedder = OpenAIEmbeddings(
            model="text-embedding-3-small",
            openai_api_key=settings.openai_api_key,
        )
    else:
        # Free local fallback — all-MiniLM-L6-v2
        from langchain_community.embeddings import HuggingFaceEmbeddings
        _embedder = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )

    return _embedder


def embed_texts(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for a list of texts."""
    embedder = get_embedder()
    return embedder.embed_documents(texts)


def embed_query(query: str) -> List[float]:
    """Generate embedding for a single query."""
    embedder = get_embedder()
    return embedder.embed_query(query)
