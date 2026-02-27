"""
Document ingestion pipeline:
1. Extract text from PDF/DOCX/TXT/MD
2. Clean and chunk
3. Generate embeddings
4. Store in ChromaDB with metadata
5. Auto-summarize and tag with LLM
"""
import os
import uuid
import json
import asyncio
from datetime import datetime
from typing import Optional
from pathlib import Path

from services.chunker import TextChunker
from services.embedder import embed_texts
from services.summarizer import summarize_and_tag
from db.chroma import get_collection
from models.schemas import DocumentStatus

# In-memory document store (replace with DB in production)
_documents: dict = {}


def get_document_store() -> dict:
    return _documents


def get_document(doc_id: str) -> Optional[dict]:
    return _documents.get(doc_id)


def list_documents() -> list:
    return list(_documents.values())


async def ingest_document(file_path: str, original_name: str, file_type: str, file_size: int) -> str:
    """Full ingestion pipeline — returns document ID."""
    doc_id = str(uuid.uuid4())
    created_at = datetime.utcnow()

    # Register document immediately as pending
    _documents[doc_id] = {
        "id": doc_id,
        "filename": Path(file_path).name,
        "original_name": original_name,
        "file_type": file_type,
        "file_size": file_size,
        "status": DocumentStatus.PROCESSING,
        "chunk_count": 0,
        "tags": [],
        "summary": "",
        "key_concepts": [],
        "created_at": created_at.isoformat(),
        "updated_at": created_at.isoformat(),
        "word_count": 0,
        "page_count": 0,
    }

    # Run pipeline in background
    asyncio.create_task(_run_pipeline(doc_id, file_path, original_name, file_type))
    return doc_id


async def _run_pipeline(doc_id: str, file_path: str, original_name: str, file_type: str):
    """Async pipeline: extract → chunk → embed → store → summarize."""
    try:
        # Step 1: Extract text
        text, page_count = extract_text(file_path, file_type)
        word_count = len(text.split())

        _documents[doc_id].update({
            "word_count": word_count,
            "page_count": page_count,
        })

        if not text.strip():
            _documents[doc_id]["status"] = DocumentStatus.ERROR
            _documents[doc_id]["summary"] = "Could not extract text from document."
            return

        # Step 2: Chunk
        chunker = TextChunker(chunk_size=512, chunk_overlap=64)
        chunks = chunker.chunk_text(text, metadata={
            "document_id": doc_id,
            "document_name": original_name,
        })

        if not chunks:
            _documents[doc_id]["status"] = DocumentStatus.ERROR
            return

        # Step 3: Embed
        texts = [c["content"] for c in chunks]
        embeddings = await asyncio.get_event_loop().run_in_executor(
            None, embed_texts, texts
        )

        # Step 4: Store in ChromaDB
        collection = get_collection()
        ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
        metadatas = [c["metadata"] for c in chunks]

        collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas,
        )

        # Step 5: LLM summarization + tagging (first 3000 chars for speed)
        summary_text = text[:3000]
        ai_result = await summarize_and_tag(summary_text, original_name)

        _documents[doc_id].update({
            "status": DocumentStatus.READY,
            "chunk_count": len(chunks),
            "tags": ai_result.get("tags", []),
            "summary": ai_result.get("summary", ""),
            "key_concepts": ai_result.get("key_concepts", []),
            "updated_at": datetime.utcnow().isoformat(),
        })

    except Exception as e:
        _documents[doc_id]["status"] = DocumentStatus.ERROR
        _documents[doc_id]["summary"] = f"Error during processing: {str(e)}"
        print(f"[Ingestion Error] {doc_id}: {e}")


def extract_text(file_path: str, file_type: str) -> tuple[str, int]:
    """Extract text from various document types."""
    file_type = file_type.lower()

    if file_type == "pdf":
        return _extract_pdf(file_path)
    elif file_type in ["docx", "doc"]:
        return _extract_docx(file_path)
    elif file_type in ["txt", "md", "markdown"]:
        return _extract_text_file(file_path)
    else:
        return _extract_text_file(file_path)


def _extract_pdf(file_path: str) -> tuple[str, int]:
    """Extract text from PDF using PyMuPDF."""
    import fitz  # pymupdf
    texts = []
    page_count = 0
    with fitz.open(file_path) as doc:
        page_count = len(doc)
        for page in doc:
            texts.append(page.get_text("text"))
    return "\n\n".join(texts), page_count


def _extract_docx(file_path: str) -> tuple[str, int]:
    """Extract text from DOCX."""
    from docx import Document
    doc = Document(file_path)
    text = "\n".join([para.text for para in doc.paragraphs if para.text])
    return text, 1


def _extract_text_file(file_path: str) -> tuple[str, int]:
    """Extract text from TXT/MD files."""
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        text = f.read()
    return text, 1


def delete_document(doc_id: str) -> bool:
    """Remove document from store and vector DB."""
    if doc_id not in _documents:
        return False

    # Delete from ChromaDB
    try:
        collection = get_collection()
        results = collection.get(where={"document_id": doc_id})
        if results and results["ids"]:
            collection.delete(ids=results["ids"])
    except Exception as e:
        print(f"[Delete Error] {e}")

    del _documents[doc_id]
    return True
