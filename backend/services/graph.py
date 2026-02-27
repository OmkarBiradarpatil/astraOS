"""
Knowledge graph service — builds graph data from document relationships.
"""
from typing import List
from services.ingestion import list_documents
import hashlib


def build_knowledge_graph() -> dict:
    """Build graph nodes and edges from vault documents."""
    documents = list_documents()
    nodes = []
    edges = []

    concept_to_docs = {}  # concept/tag -> [doc_ids]

    for doc in documents:
        if doc["status"] != "ready":
            continue

        # Document node
        nodes.append({
            "id": doc["id"],
            "label": _truncate(doc["original_name"], 30),
            "type": "document",
            "size": 18,
            "color": "#7C3AED",
            "metadata": {
                "summary": doc.get("summary", ""),
                "word_count": doc.get("word_count", 0),
                "tags": doc.get("tags", []),
            }
        })

        # Concept nodes + edges from key_concepts
        for concept in doc.get("key_concepts", []):
            concept_id = "concept_" + hashlib.md5(concept.lower().encode()).hexdigest()[:8]
            if concept_id not in [n["id"] for n in nodes]:
                nodes.append({
                    "id": concept_id,
                    "label": concept,
                    "type": "concept",
                    "size": 10,
                    "color": "#06B6D4",
                    "metadata": {}
                })
            edges.append({
                "source": doc["id"],
                "target": concept_id,
                "weight": 0.8,
                "label": "contains",
            })
            concept_to_docs.setdefault(concept.lower(), []).append(doc["id"])

        # Tag nodes + edges
        for tag in doc.get("tags", []):
            tag_id = "tag_" + hashlib.md5(tag.lower().encode()).hexdigest()[:8]
            if tag_id not in [n["id"] for n in nodes]:
                nodes.append({
                    "id": tag_id,
                    "label": f"#{tag}",
                    "type": "tag",
                    "size": 8,
                    "color": "#F59E0B",
                    "metadata": {}
                })
            edges.append({
                "source": doc["id"],
                "target": tag_id,
                "weight": 0.5,
                "label": "tagged",
            })

    # Connect documents that share concepts
    for concept, doc_ids in concept_to_docs.items():
        if len(doc_ids) > 1:
            for i in range(len(doc_ids)):
                for j in range(i + 1, len(doc_ids)):
                    edges.append({
                        "source": doc_ids[i],
                        "target": doc_ids[j],
                        "weight": 0.3,
                        "label": f"shares: {concept}",
                    })

    return {"nodes": nodes, "edges": edges}


def _truncate(text: str, max_len: int) -> str:
    return text if len(text) <= max_len else text[:max_len - 3] + "..."
