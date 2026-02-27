"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Loader2, Sparkles, ChevronRight } from "lucide-react";
import { searchVault } from "@/lib/api";

interface SearchResult {
    chunk_id: string;
    document_id: string;
    document_name: string;
    content: string;
    score: number;
    chunk_index: number;
}

const exampleQueries = [
    "transformer attention mechanism",
    "distributed systems consensus",
    "machine learning optimization",
    "neural network backpropagation",
    "quantum computing algorithms",
];

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const doSearch = async (q?: string) => {
        const searchQ = q || query;
        if (!searchQ.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            const res = await searchVault(searchQ.trim());
            setResults(res.results || []);
        } catch {
            setResults([]);
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
                    Semantic <span className="gradient-text">Search</span>
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                    Search using natural language. AI understands meaning, not just keywords.
                </p>
            </motion.div>

            {/* Search bar */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                    <div style={{ flex: 1, position: "relative" }}>
                        <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                        <input
                            className="input-field"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && doSearch()}
                            placeholder="Ask in natural language: 'how do transformers work?'"
                            style={{ paddingLeft: 44, fontSize: 15, padding: "13px 14px 13px 44px" }}
                        />
                    </div>
                    <button className="btn-primary" onClick={() => doSearch()} disabled={!query.trim() || loading}
                        style={{ padding: "0 24px", opacity: (!query.trim() || loading) ? 0.6 : 1 }}>
                        {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : "Search"}
                    </button>
                </div>
            </motion.div>

            {/* Example queries */}
            {!searched && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>Try these examples:</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {exampleQueries.map((q) => (
                            <button key={q} onClick={() => { setQuery(q); doSearch(q); }}
                                style={{
                                    padding: "6px 14px", borderRadius: 20, background: "var(--bg-card)", border: "1px solid var(--border)",
                                    fontSize: 12, color: "var(--text-secondary)", cursor: "pointer", transition: "all 0.2s"
                                }}
                                onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = "var(--purple)"; (e.target as HTMLElement).style.color = "#a78bfa"; }}
                                onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = "var(--border)"; (e.target as HTMLElement).style.color = "var(--text-secondary)"; }}>
                                {q}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Results */}
            <AnimatePresence>
                {searched && !loading && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 28 }}>
                        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                            <Sparkles size={14} color="#a78bfa" />
                            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
                                {results.length > 0 ? `${results.length} results for "${query}"` : `No results for "${query}"`}
                            </span>
                        </div>

                        {results.length === 0 ? (
                            <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>No matches found</div>
                                <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                                    Try different search terms, or upload more documents related to this topic.
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {results.map((r, i) => (
                                    <motion.div key={r.chunk_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                        className="card" style={{ padding: 20 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <FileText size={14} color="#a78bfa" />
                                                <span style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa" }}>
                                                    {r.document_name?.replace(/\.[^.]+$/, "")}
                                                </span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <div style={{ height: 4, width: 60, background: "var(--bg-secondary)", borderRadius: 2, overflow: "hidden" }}>
                                                    <div style={{ height: "100%", width: `${r.score * 100}%`, background: "linear-gradient(90deg,#7c3aed,#06b6d4)", borderRadius: 2 }} />
                                                </div>
                                                <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>{(r.score * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                        <p style={{
                                            fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7,
                                            overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" as any
                                        }}>
                                            {r.content}
                                        </p>
                                        <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-muted)" }}>
                                            Chunk #{r.chunk_index + 1}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
