const API_BASE = "/api";

export async function fetchVaultStats() {
    const res = await fetch(`${API_BASE}/vault/stats`);
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
}

export async function fetchDocuments() {
    const res = await fetch(`${API_BASE}/vault/documents`);
    if (!res.ok) throw new Error("Failed to fetch documents");
    return res.json();
}

export async function fetchDocument(id: string) {
    const res = await fetch(`${API_BASE}/vault/documents/${id}`);
    if (!res.ok) throw new Error("Document not found");
    return res.json();
}

export async function uploadDocument(file: File): Promise<{ id: string; status: string; message: string }> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/vault/upload`, { method: "POST", body: formData });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Upload failed");
    }
    return res.json();
}

export async function deleteDocument(id: string) {
    const res = await fetch(`${API_BASE}/vault/documents/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    return res.json();
}

export async function searchVault(query: string, documentIds?: string[]) {
    const res = await fetch(`${API_BASE}/search/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, document_ids: documentIds, top_k: 12 }),
    });
    if (!res.ok) throw new Error("Search failed");
    return res.json();
}

export async function chatWithVault(
    message: string,
    documentIds?: string[],
    history?: Array<{ role: string; content: string }>
) {
    const res = await fetch(`${API_BASE}/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, document_ids: documentIds, conversation_history: history || [] }),
    });
    if (!res.ok) throw new Error("Chat failed");
    return res.json();
}

export async function* streamChat(
    message: string,
    documentIds?: string[],
    history?: Array<{ role: string; content: string }>
) {
    const res = await fetch(`${API_BASE}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, document_ids: documentIds, conversation_history: history || [] }),
    });
    if (!res.ok) throw new Error("Stream failed");

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
            try {
                yield JSON.parse(line.slice(6));
            } catch { }
        }
    }
}

export async function fetchKnowledgeGraph() {
    const res = await fetch(`${API_BASE}/graph/`);
    if (!res.ok) throw new Error("Failed to fetch graph");
    return res.json();
}

export async function fetchInsights() {
    const res = await fetch(`${API_BASE}/insights/`);
    if (!res.ok) throw new Error("Failed to fetch insights");
    return res.json();
}

export async function fetchStudyContent(docId: string) {
    const res = await fetch(`${API_BASE}/insights/study/${docId}`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to generate study content");
    return res.json();
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function getFileIcon(type: string): string {
    const icons: Record<string, string> = {
        pdf: "📄", docx: "📝", doc: "📝", txt: "📃", md: "📋", markdown: "📋",
    };
    return icons[type] || "📁";
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        ready: "badge-green", processing: "badge-amber", error: "badge-red", pending: "badge-amber",
    };
    return colors[status] || "tag";
}
