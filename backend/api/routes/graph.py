from fastapi import APIRouter
from services.graph import build_knowledge_graph

router = APIRouter(prefix="/graph", tags=["graph"])


@router.get("/")
async def get_knowledge_graph():
    """Get the full knowledge graph for visualization."""
    graph = build_knowledge_graph()
    return graph
