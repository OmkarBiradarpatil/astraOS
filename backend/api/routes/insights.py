from fastapi import APIRouter, HTTPException
from services.summarizer import generate_insights, generate_study_content
from services.ingestion import list_documents, get_document, extract_text

router = APIRouter(prefix="/insights", tags=["insights"])


@router.get("/")
async def get_insights():
    """Get weekly AI insights across all vault documents."""
    documents = list_documents()
    ready_docs = [d for d in documents if d.get("status") == "ready"]
    result = await generate_insights(ready_docs)
    return result


@router.post("/study/{doc_id}")
async def get_study_content(doc_id: str):
    """Generate flashcards, quiz, and key points for a document."""
    doc = get_document(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc.get("status") != "ready":
        raise HTTPException(status_code=400, detail="Document is still processing")

    # Extract text again for study content
    from core.config import get_settings
    import os
    settings = get_settings()
    file_path = os.path.join(settings.upload_dir, doc["filename"])
    try:
        text, _ = extract_text(file_path, doc["file_type"])
    except Exception:
        text = doc.get("summary", "")

    result = await generate_study_content(text[:5000], doc["original_name"])
    return result
