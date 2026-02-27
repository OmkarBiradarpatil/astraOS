from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class DocumentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    READY = "ready"
    ERROR = "error"


class DocumentMetadata(BaseModel):
    id: str
    filename: str
    original_name: str
    file_type: str
    file_size: int
    status: DocumentStatus
    chunk_count: int = 0
    tags: List[str] = []
    summary: str = ""
    key_concepts: List[str] = []
    created_at: datetime
    updated_at: datetime
    word_count: int = 0
    page_count: int = 0


class DocumentUploadResponse(BaseModel):
    id: str
    filename: str
    status: str
    message: str


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    sources: Optional[List[dict]] = None
    timestamp: Optional[datetime] = None


class ChatRequest(BaseModel):
    message: str
    document_ids: Optional[List[str]] = None  # None = search all
    conversation_history: Optional[List[ChatMessage]] = []


class SearchRequest(BaseModel):
    query: str
    document_ids: Optional[List[str]] = None
    top_k: int = Field(default=10, ge=1, le=50)


class SearchResult(BaseModel):
    chunk_id: str
    document_id: str
    document_name: str
    content: str
    score: float
    page_number: Optional[int] = None
    tags: List[str] = []


class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # "document" | "concept" | "tag"
    size: int = 10
    color: str = "#7C3AED"
    metadata: dict = {}


class GraphEdge(BaseModel):
    source: str
    target: str
    weight: float = 1.0
    label: str = ""


class KnowledgeGraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]


class InsightResponse(BaseModel):
    weekly_summary: str
    top_concepts: List[str]
    learning_streaks: int
    document_count: int
    suggested_connections: List[dict]


class StudyContent(BaseModel):
    flashcards: List[dict]  # [{question, answer}]
    quiz: List[dict]       # [{question, options, correct_index}]
    summary: str
    key_points: List[str]
