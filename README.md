# AstraOS AI Vault — README

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API Key (optional — uses free local model if not provided)

---

### 1. Backend Setup (FastAPI)

```bash
cd AstraOs/backend

# Copy env template
copy .env.example .env

# Edit .env and add your OpenAI API key (optional)
# OPENAI_API_KEY=sk-...

# Install dependencies
pip install -r requirements.txt

# Start backend
uvicorn main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**
API docs at: **http://localhost:8000/docs**

---

### 2. Frontend Setup (Next.js)

```bash
cd AstraOs/astraos-ui

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## ✨ Features

| Feature | Description |
|---|---|
| 📤 **Upload Center** | Drag-and-drop PDF, DOCX, TXT, MD |
| 🤖 **AI Chat** | Streaming Q&A across your vault |
| 🔍 **Semantic Search** | Natural language vector search |
| 🕸️ **Knowledge Graph** | Visual map of concept connections |
| 📚 **Study Mode** | AI flashcards + quiz generation |
| 💡 **AI Insights** | Weekly learning intelligence |
| 🏷️ **Auto-Tagging** | GPT extracts tags + summaries |

## 🧠 AI Stack
- **RAG**: LangChain + ChromaDB
- **LLM**: GPT-4o-mini (or free HuggingFace fallback)
- **Embeddings**: text-embedding-3-small (or all-MiniLM-L6-v2 free)
- **PDF Parsing**: PyMuPDF
