from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from models.schemas import ChatRequest
from services.rag import chat_with_documents, stream_chat_with_documents

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/")
async def chat(request: ChatRequest):
    """Non-streaming RAG chat with documents."""
    history = [msg.dict() for msg in (request.conversation_history or [])]
    result = await chat_with_documents(
        query=request.message,
        document_ids=request.document_ids,
        conversation_history=history,
    )
    return result


@router.post("/stream")
async def stream_chat(request: ChatRequest):
    """Server-Sent Events streaming chat."""
    history = [msg.dict() for msg in (request.conversation_history or [])]

    async def event_generator():
        async for chunk in stream_chat_with_documents(
            query=request.message,
            document_ids=request.document_ids,
            conversation_history=history,
        ):
            yield chunk

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
