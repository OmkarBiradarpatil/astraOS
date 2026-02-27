"""
LLM-powered summarization, tagging, and key concept extraction.
Optimized: max_tokens caps + short prompts = 2-3x faster responses.
"""
import json
from core.config import get_settings

settings = get_settings()


def _get_llm(max_tokens: int = 300):
    if settings.openai_api_key:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model=settings.llm_model,
            openai_api_key=settings.openai_api_key,
            temperature=0.2,
            max_tokens=max_tokens,
        )
    return None


def _parse_json(content: str) -> dict:
    """Robust JSON extraction from LLM response."""
    c = content.strip()
    if "```json" in c:
        c = c.split("```json")[1].split("```")[0].strip()
    elif "```" in c:
        c = c.split("```")[1].split("```")[0].strip()
    return json.loads(c)


async def summarize_and_tag(text: str, document_name: str) -> dict:
    """Generate summary, tags, and key concepts. Optimized for speed."""
    llm = _get_llm(max_tokens=300)
    if not llm:
        return {
            "summary": f"'{document_name}' indexed and ready for AI queries.",
            "tags": ["document", "knowledge"],
            "key_concepts": [],
        }

    # Shorter text = faster response. Use first 1500 chars only.
    excerpt = text[:1500].strip()

    prompt = f"""Analyze this document excerpt. Respond ONLY with JSON, no explanation.

Doc: "{document_name[:60]}"
Text: {excerpt}

JSON:
{{"summary":"2 sentence summary","tags":["tag1","tag2","tag3"],"key_concepts":["c1","c2","c3","c4"]}}"""

    try:
        from langchain_core.messages import HumanMessage
        response = await llm.ainvoke([HumanMessage(content=prompt)])
        return _parse_json(response.content)
    except Exception as e:
        print(f"[Summarizer] {e}")
        return {
            "summary": f"'{document_name}' has been indexed and is ready for AI queries.",
            "tags": ["document"],
            "key_concepts": [],
        }


async def generate_study_content(text: str, document_name: str) -> dict:
    """Generate flashcards, quiz, key points. Max 5 flashcards + 3 quiz."""
    llm = _get_llm(max_tokens=900)
    if not llm:
        return {
            "flashcards": [{"question": "What is the main topic?", "answer": "Add OPENAI_API_KEY to enable AI."}],
            "quiz": [], "summary": "Add OpenAI API key for study mode.", "key_points": [],
        }

    excerpt = text[:3000].strip()

    prompt = f"""Create study materials from this document. JSON only.

Doc: "{document_name[:60]}"
Text: {excerpt}

{{"flashcards":[{{"question":"...","answer":"..."}},{{"question":"...","answer":"..."}},{{"question":"...","answer":"..."}},{{"question":"...","answer":"..."}},{{"question":"...","answer":"..."}}],"quiz":[{{"question":"...","options":["A","B","C","D"],"correct_index":0,"explanation":"..."}},{{"question":"...","options":["A","B","C","D"],"correct_index":1,"explanation":"..."}},{{"question":"...","options":["A","B","C","D"],"correct_index":2,"explanation":"..."}}],"summary":"1-2 sentence summary","key_points":["p1","p2","p3","p4"]}}"""

    try:
        from langchain_core.messages import HumanMessage
        response = await llm.ainvoke([HumanMessage(content=prompt)])
        return _parse_json(response.content)
    except Exception as e:
        print(f"[StudyContent] {e}")
        return {"flashcards": [], "quiz": [], "summary": "", "key_points": []}


async def generate_insights(documents: list) -> dict:
    """Generate weekly insights from vault documents. Fast and concise."""
    llm = _get_llm(max_tokens=400)
    if not llm or not documents:
        return {
            "weekly_summary": "Upload documents to get weekly AI insights.",
            "top_concepts": [],
            "learning_streaks": len(documents),
            "document_count": len(documents),
            "suggested_connections": [],
        }

    all_tags = list(set(t for d in documents for t in d.get("tags", [])))[:15]
    all_concepts = list(set(c for d in documents for c in d.get("key_concepts", [])))[:15]
    doc_names = [d.get("original_name", "")[:30] for d in documents[:8]]

    prompt = f"""Vault insight for a knowledge worker. JSON only.

Docs: {', '.join(doc_names)}
Tags: {', '.join(all_tags)}
Concepts: {', '.join(all_concepts)}

{{"weekly_summary":"2 sentence insight","top_concepts":["c1","c2","c3","c4","c5"],"suggested_connections":[{{"from":"doc1","to":"doc2","reason":"brief"}}]}}"""

    try:
        from langchain_core.messages import HumanMessage
        response = await llm.ainvoke([HumanMessage(content=prompt)])
        result = _parse_json(response.content)
        result["learning_streaks"] = len(documents)
        result["document_count"] = len(documents)
        return result
    except Exception as e:
        print(f"[Insights] {e}")
        return {
            "weekly_summary": f"You have {len(documents)} documents. Keep building your vault!",
            "top_concepts": all_concepts[:5],
            "learning_streaks": len(documents),
            "document_count": len(documents),
            "suggested_connections": [],
        }
