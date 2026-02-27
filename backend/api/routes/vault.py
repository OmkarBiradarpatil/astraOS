import os
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from services.ingestion import ingest_document, list_documents, get_document, delete_document
from models.schemas import DocumentUploadResponse
from core.config import get_settings
import uuid
import aiofiles

router = APIRouter(prefix="/vault", tags=["vault"])
settings = get_settings()


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload and ingest a document into the vault."""
    os.makedirs(settings.upload_dir, exist_ok=True)

    # Validate file type
    allowed_types = ["pdf", "docx", "doc", "txt", "md", "markdown"]
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"File type '.{ext}' not supported. Allowed: {', '.join(allowed_types)}"
        )

    # Check file size
    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > settings.max_file_size_mb:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Max size: {settings.max_file_size_mb}MB"
        )

    # Save to disk
    safe_name = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(settings.upload_dir, safe_name)
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(content)

    # Begin ingestion pipeline
    doc_id = await ingest_document(
        file_path=file_path,
        original_name=file.filename,
        file_type=ext,
        file_size=len(content),
    )

    return DocumentUploadResponse(
        id=doc_id,
        filename=file.filename,
        status="processing",
        message="Document uploaded and being processed. Check status via /vault/{id}",
    )


@router.get("/documents")
async def get_all_documents():
    """List all documents in the vault."""
    docs = list_documents()
    return {"documents": docs, "total": len(docs)}


@router.get("/documents/{doc_id}")
async def get_document_by_id(doc_id: str):
    """Get a single document's metadata and status."""
    doc = get_document(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.delete("/documents/{doc_id}")
async def delete_document_by_id(doc_id: str):
    """Delete a document from the vault."""
    success = delete_document(doc_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document deleted successfully"}


@router.get("/stats")
async def get_vault_stats():
    """Get overall vault statistics."""
    docs = list_documents()
    ready_docs = [d for d in docs if d["status"] == "ready"]
    all_tags = list(set(tag for d in ready_docs for tag in d.get("tags", [])))
    all_concepts = list(set(c for d in ready_docs for c in d.get("key_concepts", [])))
    total_words = sum(d.get("word_count", 0) for d in ready_docs)

    return {
        "total_documents": len(docs),
        "ready_documents": len(ready_docs),
        "total_chunks": sum(d.get("chunk_count", 0) for d in ready_docs),
        "total_words": total_words,
        "unique_tags": len(all_tags),
        "unique_concepts": len(all_concepts),
        "top_tags": all_tags[:10],
        "top_concepts": all_concepts[:10],
    }
