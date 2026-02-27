"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Key, Server, Info } from "lucide-react";

export default function SettingsPage() {
    const [apiKey, setApiKey] = useState("");
    const [saved, setSaved] = useState(false);

    return (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
                    <span className="gradient-text">Settings</span>
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Configure your AstraOS AI Vault.</p>
            </motion.div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* API Config */}
                <div className="card" style={{ padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                        <Key size={18} color="#a78bfa" />
                        <span style={{ fontWeight: 700, fontSize: 16 }}>AI Configuration</span>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>
                            OpenAI API Key
                        </label>
                        <input className="input-field" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
                            placeholder="sk-... (set in backend .env file)" />
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
                            Set OPENAI_API_KEY in <code>AstraOs/backend/.env</code>. The frontend reads this via the backend.
                        </p>
                    </div>
                </div>

                {/* Backend Info */}
                <div className="card" style={{ padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                        <Server size={18} color="#22d3ee" />
                        <span style={{ fontWeight: 700, fontSize: 16 }}>Backend Connection</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {[
                            { label: "API Endpoint", value: "http://localhost:8000" },
                            { label: "Vector DB", value: "ChromaDB (local persistent)" },
                            { label: "Default LLM", value: "gpt-4o-mini" },
                            { label: "Embedding Model", value: "text-embedding-3-small / all-MiniLM-L6-v2" },
                        ].map(({ label, value }) => (
                            <div key={label} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "10px 14px", background: "var(--bg-secondary)", borderRadius: 10
                            }}>
                                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{label}</span>
                                <code style={{ fontSize: 12, color: "#a78bfa" }}>{value}</code>
                            </div>
                        ))}
                    </div>
                </div>

                {/* About */}
                <div className="card glass-bright" style={{ padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                        <Info size={18} color="#f59e0b" />
                        <span style={{ fontWeight: 700, fontSize: 16 }}>About AstraOS AI Vault</span>
                    </div>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                        AstraOS AI Vault is your AI-powered Second Brain. Upload documents, research papers, notes, and the AI indexes,
                        summarizes, and connects your knowledge. Ask questions across your entire vault, explore the knowledge graph,
                        and generate study materials automatically.
                    </p>
                    <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {["Next.js 14", "FastAPI", "LangChain", "ChromaDB", "OpenAI", "Framer Motion"].map(t => (
                            <span key={t} className="tag badge-cyan">{t}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
