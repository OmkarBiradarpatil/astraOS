"""
RAG (Retrieval Augmented Generation) query engine.
Handles semantic search + LLM-powered Q&A with streaming.
"""
from typing import List, Optional, AsyncGenerator
from services.embedder import embed_query
from db.chroma import get_collection
from core.config import get_settings

settings = get_settings()


def _get_llm(stream: bool = False):
    if settings.openai_api_key:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model=settings.llm_model,
            openai_api_key=settings.openai_api_key,
            temperature=0.3,
            max_tokens=600,
            streaming=stream,
        )
    return None


async def semantic_search(
    query: str,
    document_ids: Optional[List[str]] = None,
    top_k: int = 10,
) -> List[dict]:
    """Retrieve most relevant chunks for a query."""
    collection = get_collection()
    query_embedding = embed_query(query)

    where_filter = None
    if document_ids and len(document_ids) > 0:
        if len(document_ids) == 1:
            where_filter = {"document_id": document_ids[0]}
        else:
            where_filter = {"document_id": {"$in": document_ids}}

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(top_k, collection.count() or 1),
        where=where_filter,
        include=["documents", "metadatas", "distances"],
    )

    search_results = []
    if results and results["ids"] and results["ids"][0]:
        for i, chunk_id in enumerate(results["ids"][0]):
            metadata = results["metadatas"][0][i] if results["metadatas"] else {}
            distance = results["distances"][0][i] if results["distances"] else 1.0
            score = max(0.0, 1.0 - distance)

            search_results.append({
                "chunk_id": chunk_id,
                "document_id": metadata.get("document_id", ""),
                "document_name": metadata.get("document_name", ""),
                "content": results["documents"][0][i],
                "score": round(score, 4),
                "page_number": metadata.get("page_number"),
                "chunk_index": metadata.get("chunk_index", 0),
            })

    return search_results


async def chat_with_documents(
    query: str,
    document_ids: Optional[List[str]] = None,
    conversation_history: Optional[List[dict]] = None,
) -> dict:
    """Non-streaming RAG answer for a question."""
    # Retrieve relevant context
    chunks = await semantic_search(query, document_ids, top_k=4)

    if not chunks:
        return {
            "answer": "I couldn't find relevant information in your vault for this question. Try uploading related documents first.",
            "sources": [],
        }

    context = "\n\n---\n\n".join([
        f"[{c['document_name']}]\n{c['content'][:400]}"
        for c in chunks[:3]
    ])

    llm = _get_llm()
    if not llm:
        return {
            "answer": "AI chat requires an OpenAI API key. Please add OPENAI_API_KEY to your .env file. The semantic search above shows the most relevant content from your vault.",
            "sources": chunks[:5],
        }

    # Build conversation history
    from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
    messages = [
        SystemMessage(content="You are AstraOS AI, a knowledge assistant. Answer concisely from the provided vault context. Cite document names when relevant.")
    ]

    if conversation_history:
        for msg in conversation_history[-6:]:  # Last 6 messages
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                messages.append(AIMessage(content=msg["content"]))

    messages.append(HumanMessage(content=f"""Vault context:
{context}

Q: {query}"""))

    response = await llm.ainvoke(messages)
    return {
        "answer": response.content,
        "sources": chunks[:3],
    }


async def stream_chat_with_documents(
    query: str,
    document_ids: Optional[List[str]] = None,
    conversation_history: Optional[List[dict]] = None,
) -> AsyncGenerator[str, None]:
    """Streaming RAG answer — yields text chunks."""
    chunks = await semantic_search(query, document_ids, top_k=4)

    context = "\n\n---\n\n".join([
        f"[{c['document_name']}]\n{c['content'][:400]}"
        for c in chunks[:3]
    ]) if chunks else "No specific documents found."

    llm = _get_llm(stream=True)
    if not llm:
        yield "data: AI streaming requires OPENAI_API_KEY in your .env file.\n\n"
        yield "data: [DONE]\n\n"
        return

    from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
    messages = [
        SystemMessage(content="You are AstraOS AI. Answer concisely from the vault context. Cite document names when relevant."),
    ]

    if conversation_history:
        for msg in conversation_history[-4:]:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                messages.append(AIMessage(content=msg["content"]))

    messages.append(HumanMessage(content=f"Context:\n{context}\n\nQuestion: {query}"))

    # Stream sources first
    import json
    yield f"data: {json.dumps({'type': 'sources', 'sources': chunks[:3]})}\n\n"

    async for chunk in llm.astream(messages):
        if chunk.content:
            yield f"data: {json.dumps({'type': 'token', 'token': chunk.content})}\n\n"

    yield f"data: {json.dumps({'type': 'done'})}\n\n"
