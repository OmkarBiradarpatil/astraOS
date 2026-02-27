import chromadb
from chromadb.config import Settings
from core.config import get_settings
import os

_client = None
_collection = None


def get_chroma_client():
    global _client
    if _client is None:
        settings = get_settings()
        os.makedirs(settings.chroma_persist_dir, exist_ok=True)
        _client = chromadb.PersistentClient(
            path=settings.chroma_persist_dir,
            settings=Settings(anonymized_telemetry=False)
        )
    return _client


def get_collection(collection_name: str = "astraos_vault"):
    global _collection
    if _collection is None:
        client = get_chroma_client()
        _collection = client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}
        )
    return _collection


def reset_collection_cache():
    """Reset collection cache (e.g., after deletion)"""
    global _collection
    _collection = None
