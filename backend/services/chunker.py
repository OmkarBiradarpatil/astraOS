"""
Text chunking strategy for document ingestion.
Uses recursive character splitting with semantic boundaries.
"""
from typing import List
import re


class TextChunker:
    def __init__(
        self,
        chunk_size: int = 512,
        chunk_overlap: int = 64,
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_text(self, text: str, metadata: dict = {}) -> List[dict]:
        """Split text into overlapping chunks with metadata."""
        # Clean text
        text = self._clean_text(text)
        if not text.strip():
            return []

        # Split into sentences first for semantic coherence
        sentences = self._split_into_sentences(text)
        chunks = self._build_chunks(sentences)

        return [
            {
                "content": chunk,
                "metadata": {
                    **metadata,
                    "chunk_index": i,
                    "char_count": len(chunk),
                },
            }
            for i, chunk in enumerate(chunks)
        ]

    def _clean_text(self, text: str) -> str:
        """Remove excessive whitespace and normalize."""
        text = re.sub(r'\n{3,}', '\n\n', text)
        text = re.sub(r' {2,}', ' ', text)
        text = re.sub(r'\x00', '', text)
        return text.strip()

    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences."""
        # Split on sentence boundaries
        sentences = re.split(r'(?<=[.!?])\s+', text)
        # Also split on paragraph breaks
        result = []
        for s in sentences:
            if '\n\n' in s:
                parts = s.split('\n\n')
                result.extend([p.strip() for p in parts if p.strip()])
            else:
                if s.strip():
                    result.append(s.strip())
        return result

    def _build_chunks(self, sentences: List[str]) -> List[str]:
        """Build overlapping chunks from sentences."""
        chunks = []
        current_chunk = ""
        overlap_buffer = ""

        for sentence in sentences:
            # If adding this sentence would exceed chunk_size, save current and start new
            if len(current_chunk) + len(sentence) > self.chunk_size and current_chunk:
                chunks.append(current_chunk.strip())
                # Calculate overlap
                words = current_chunk.split()
                overlap_word_count = max(1, int(len(words) * (self.chunk_overlap / self.chunk_size)))
                overlap_buffer = " ".join(words[-overlap_word_count:])
                current_chunk = overlap_buffer + " " + sentence
            else:
                current_chunk += (" " if current_chunk else "") + sentence

        if current_chunk.strip():
            chunks.append(current_chunk.strip())

        return chunks
