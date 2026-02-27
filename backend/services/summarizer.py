"""
LLM-powered summarization, tagging, and key concept extraction.
"""
import json
from typing import Optional
from core.config import get_settings

settings = get_settings()


def _get_llm():
    if settings.openai_api_key:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model=settings.llm_model,
            openai_api_key=settings.openai_api_key,
            temperature=0.3,
        )
    return None


async def summarize_and_tag(text: str, document_name: str) -> dict:
    """Generate summary, tags, and key concepts for a document."""
    llm = _get_llm()
    if not llm:
        return {
            "summary": "AI features require an OpenAI API key. Please add OPENAI_API_KEY to your .env file.",
            "tags": ["document", "knowledge"],
            "key_concepts": [],
        }

    prompt = f"""You are an expert knowledge analyst. Analyze the following document excerpt and respond ONLY with valid JSON.

Document: "{document_name}"

Text:
{text}

Respond with this exact JSON structure:
{{
  "summary": "A clear 2-3 sentence summary of this document",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "key_concepts": ["concept1", "concept2", "concept3", "concept4", "concept5"]
}}

Rules:
- summary: 2-3 sentences, informative and clear
- tags: 3-8 relevant lowercase tags
- key_concepts: 3-8 key technical or thematic concepts from the text
"""

    try:
        from langchain_core.messages import HumanMessage
        response = await llm.ainvoke([HumanMessage(content=prompt)])
        content = response.content.strip()
        # Extract JSON from response
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        return json.loads(content)
    except Exception as e:
        print(f"[Summarizer Error] {e}")
        return {
            "summary": f"Document '{document_name}' has been indexed and is ready for AI queries.",
            "tags": ["document"],
            "key_concepts": [],
        }


async def generate_study_content(text: str, document_name: str) -> dict:
    """Generate flashcards, quiz, and key points for study mode."""
    llm = _get_llm()
    if not llm:
        return {
            "flashcards": [{"question": "What is the main topic?", "answer": "Please add OPENAI_API_KEY to enable AI."}],
            "quiz": [],
            "summary": "AI study mode requires OpenAI API key.",
            "key_points": [],
        }

    prompt = f"""You are an expert educational content creator. Based on this document, create study materials.
    
Document: "{document_name}"
Text: {text[:4000]}

Respond ONLY with valid JSON:
{{
  "flashcards": [
    {{"question": "...", "answer": "..."}},
    {{"question": "...", "answer": "..."}}
  ],
  "quiz": [
    {{"question": "...", "options": ["A", "B", "C", "D"], "correct_index": 0, "explanation": "..."}}
  ],
  "summary": "Brief study summary...",
  "key_points": ["point1", "point2", "point3"]
}}

Create 5 flashcards and 3 quiz questions."""

    try:
        from langchain_core.messages import HumanMessage
        response = await llm.ainvoke([HumanMessage(content=prompt)])
        content = response.content.strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        return json.loads(content)
    except Exception as e:
        print(f"[Study Content Error] {e}")
        return {"flashcards": [], "quiz": [], "summary": "", "key_points": []}


async def generate_insights(documents: list) -> dict:
    """Generate weekly insights from all stored documents."""
    llm = _get_llm()
    if not llm or not documents:
        return {
            "weekly_summary": "Upload documents to get weekly AI insights.",
            "top_concepts": [],
            "learning_streaks": len(documents),
            "document_count": len(documents),
            "suggested_connections": [],
        }

    all_tags = []
    all_concepts = []
    doc_names = []
    for doc in documents:
        all_tags.extend(doc.get("tags", []))
        all_concepts.extend(doc.get("key_concepts", []))
        doc_names.append(doc.get("original_name", ""))

    prompt = f"""You are an AI learning coach. Analyze these documents in the user's vault and generate insights.

Documents: {', '.join(doc_names[:10])}
All tags: {', '.join(list(set(all_tags))[:20])}
Key concepts: {', '.join(list(set(all_concepts))[:20])}

Respond ONLY with valid JSON:
{{
  "weekly_summary": "2-3 sentence insight about what the user is learning and how their knowledge connects",
  "top_concepts": ["concept1", "concept2", "concept3", "concept4", "concept5"],
  "suggested_connections": [
    {{"from": "doc1", "to": "doc2", "reason": "brief reason"}}
  ]
}}"""

    try:
        from langchain_core.messages import HumanMessage
        response = await llm.ainvoke([HumanMessage(content=prompt)])
        content = response.content.strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        result = json.loads(content)
        result["learning_streaks"] = len(documents)
        result["document_count"] = len(documents)
        return result
    except Exception as e:
        print(f"[Insights Error] {e}")
        return {
            "weekly_summary": f"You have {len(documents)} documents in your vault. Keep learning!",
            "top_concepts": list(set(all_concepts))[:5],
            "learning_streaks": len(documents),
            "document_count": len(documents),
            "suggested_connections": [],
        }
