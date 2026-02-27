"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Brain, FileText, Sparkles, Trash2, Bot } from "lucide-react";
import { streamChat, fetchDocuments } from "@/lib/api";
import ReactMarkdown from "react-markdown";

interface Message {
    role: "user" | "assistant";
    content: string;
    sources?: any[];
    streaming?: boolean;
}

function ChatContent() {
    const params = useSearchParams();
    const docParam = params.get("doc");

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [docs, setDocs] = useState<any[]>([]);
    const [selectedDocs, setSelectedDocs] = useState<string[]>(docParam ? [docParam] : []);
    const [showDocs, setShowDocs] = useState(false);
    const messagesEnd = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchDocuments().then((d) => setDocs(d.documents || [])).catch(() => { });
    }, []);

    useEffect(() => {
        messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg = input.trim();
        setInput("");
        setLoading(true);

        const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
        setMessages(newMessages);

        // Add streaming assistant placeholder
        setMessages((m) => [...m, { role: "assistant", content: "", streaming: true, sources: [] }]);

        try {
            let fullContent = "";
            let sources: any[] = [];
            for await (const chunk of streamChat(userMsg, selectedDocs.length ? selectedDocs : undefined, messages.slice(-6))) {
                if (chunk.type === "sources") {
                    sources = chunk.sources || [];
                    setMessages((m) => m.map((msg, i) => i === m.length - 1 ? { ...msg, sources } : msg));
                } else if (chunk.type === "token") {
                    fullContent += chunk.token;
                    setMessages((m) => m.map((msg, i) => i === m.length - 1 ? { ...msg, content: fullContent } : msg));
                } else if (chunk.type === "done") {
                    setMessages((m) => m.map((msg, i) => i === m.length - 1 ? { ...msg, streaming: false } : msg));
                }
            }
        } catch {
            setMessages((m) => m.map((msg, i) => i === m.length - 1
                ? { ...msg, content: "Sorry, I couldn't connect to the AI. Make sure the backend is running on port 8000.", streaming: false }
                : msg));
        }
        setLoading(false);
    };

    const suggestions = [
        "Summarize my uploaded documents",
        "What are the key concepts in my vault?",
        "Explain the main ideas from my research",
        "What connections exist between my documents?",
    ];

    return (
        <div style={{ height: "calc(100vh - 128px)", display: "flex", gap: 20 }}>
            {/* Main chat */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                    {messages.length === 0 ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 20px" }}>
                            <div style={{
                                width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))",
                                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, border: "1px solid rgba(124,58,237,0.3)"
                            }}>
                                <Bot size={32} color="#a78bfa" />
                            </div>
                            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Ask your <span className="gradient-text">Second Brain</span></h3>
                            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 28, maxWidth: 400 }}>
                                I can answer questions across all your uploaded documents. Ask me anything about your knowledge vault.
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 440 }}>
                                {suggestions.map((s) => (
                                    <button key={s} className="card card-interactive" onClick={() => setInput(s)}
                                        style={{ padding: "12px 16px", textAlign: "left", fontSize: 14, color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: 12 }}>
                                        <Sparkles size={13} style={{ display: "inline", marginRight: 8, color: "#a78bfa" }} />{s}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <AnimatePresence>
                            {messages.map((msg, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                    style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                                    {msg.role === "user" ? (
                                        <div className="chat-message-user" style={{ maxWidth: "70%" }}>{msg.content}</div>
                                    ) : (
                                        <div style={{ maxWidth: "85%", width: "100%" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                                                <div style={{ width: 20, height: 20, borderRadius: 6, background: "linear-gradient(135deg,#7c3aed,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <Brain size={11} color="white" />
                                                </div>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: "#a78bfa" }}>AstraOS AI</span>
                                                {msg.streaming && <Loader2 size={12} style={{ color: "var(--text-muted)", animation: "spin 1s linear infinite" }} />}
                                            </div>
                                            <div className="chat-message-ai">
                                                <div className="prose-dark">
                                                    {msg.content ? (
                                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                    ) : msg.streaming ? (
                                                        <div style={{ display: "flex", gap: 4, alignItems: "center", height: 20 }}>
                                                            {[0, 1, 2].map(i => (
                                                                <div key={i} style={{
                                                                    width: 6, height: 6, borderRadius: "50%", background: "#7c3aed",
                                                                    animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite`
                                                                }} />
                                                            ))}
                                                        </div>
                                                    ) : null}
                                                </div>
                                                {msg.sources && msg.sources.length > 0 && (
                                                    <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border)", display: "flex", gap: 6, flexWrap: "wrap" }}>
                                                        <span style={{ fontSize: 11, color: "var(--text-muted)", alignSelf: "center" }}>Sources:</span>
                                                        {msg.sources.slice(0, 4).map((s, si) => (
                                                            <span key={si} className="source-chip">
                                                                <FileText size={10} /> {s.document_name?.split(".")[0]?.slice(0, 16) || "doc"}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                    <div ref={messagesEnd} />
                </div>

                {/* Input */}
                <div style={{ paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                    {selectedDocs.length > 0 && (
                        <div style={{ marginBottom: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 11, color: "var(--text-muted)", alignSelf: "center" }}>Searching in:</span>
                            {selectedDocs.map((id) => {
                                const d = docs.find((x) => x.id === id);
                                return d ? <span key={id} className="source-chip">{d.original_name?.slice(0, 20)}</span> : null;
                            })}
                        </div>
                    )}
                    <div style={{ display: "flex", gap: 10 }}>
                        <input className="input-field" value={input} onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                            placeholder="Ask anything about your vault..." style={{ flex: 1, fontSize: 15, padding: "13px 16px" }}
                        />
                        <button className="btn-primary" onClick={sendMessage} disabled={!input.trim() || loading}
                            style={{ padding: "0 20px", minWidth: 52, opacity: (!input.trim() || loading) ? 0.6 : 1 }}>
                            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={16} />}
                        </button>
                        {messages.length > 0 && (
                            <button className="btn-icon" onClick={() => setMessages([])} title="Clear chat">
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Doc selector panel */}
            <div className="card" style={{ width: 240, padding: 16, flexShrink: 0, overflowY: "auto" }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <FileText size={14} color="#a78bfa" /> Filter by Docs
                </div>
                <button className={`btn-secondary`} style={{
                    width: "100%", marginBottom: 10, fontSize: 12,
                    background: selectedDocs.length === 0 ? "rgba(124,58,237,0.1)" : "transparent",
                    borderColor: selectedDocs.length === 0 ? "rgba(124,58,237,0.4)" : "var(--border)",
                    color: selectedDocs.length === 0 ? "#a78bfa" : "var(--text-secondary)"
                }}
                    onClick={() => setSelectedDocs([])}>
                    All Documents
                </button>
                {docs.filter(d => d.status === "ready").map((d) => {
                    const selected = selectedDocs.includes(d.id);
                    return (
                        <div key={d.id} onClick={() => setSelectedDocs(s => selected ? s.filter(x => x !== d.id) : [...s, d.id])}
                            className="card-interactive" style={{
                                padding: "8px 10px", borderRadius: 8, marginBottom: 6, cursor: "pointer",
                                background: selected ? "rgba(124,58,237,0.1)" : "transparent",
                                border: `1px solid ${selected ? "rgba(124,58,237,0.4)" : "var(--border)"}`
                            }}>
                            <div style={{
                                fontSize: 12, fontWeight: 600, color: selected ? "#a78bfa" : "var(--text-secondary)",
                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                            }}>
                                {d.original_name}
                            </div>
                        </div>
                    );
                })}
                {docs.filter(d => d.status === "ready").length === 0 && (
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>Upload documents first</p>
                )}
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div style={{ color: "var(--text-muted)" }}>Loading...</div>}>
            <ChatContent />
        </Suspense>
    );
}
