from fastapi import APIRouter
from models.schemas import SearchRequest
from services.rag import semantic_search

router = APIRouter(prefix="/search", tags=["search"])


@router.post("/")
async def search_vault(request: SearchRequest):
    """Semantic search across all vault documents."""
    results = await semantic_search(
        query=request.query,
        document_ids=request.document_ids,
        top_k=request.top_k,
    )
    return {
        "query": request.query,
        "results": results,
        "total": len(results),
    }
