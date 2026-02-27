"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Loader2, TrendingUp, Brain, RefreshCw } from "lucide-react";
import { fetchInsights } from "@/lib/api";

export default function InsightsPage() {
    const [insights, setInsights] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        fetchInsights()
            .then(setInsights)
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    return (
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>AI <span className="gradient-text">Insights</span></h2>
                        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Weekly intelligence about what you've learned and how ideas connect.</p>
                    </div>
                    <button className="btn-secondary" onClick={load} disabled={loading}
                        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                        <RefreshCw size={13} style={loading ? { animation: "spin 1s linear infinite" } : {}} /> Refresh
                    </button>
                </div>
            </motion.div>

            {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 12 }}>
                    <Loader2 size={22} color="#7c3aed" style={{ animation: "spin 1s linear infinite" }} />
                    <span style={{ color: "var(--text-muted)" }}>AI is analyzing your vault...</span>
                </div>
            ) : !insights ? (
                <div className="card" style={{ textAlign: "center", padding: "60px 24px" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>💡</div>
                    <p style={{ color: "var(--text-muted)" }}>Upload documents to generate AI insights.</p>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Stats row */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                        {[
                            { label: "Documents", value: insights.document_count, icon: "📄", color: "#7c3aed" },
                            { label: "Learning Streak", value: insights.learning_streaks, icon: "🔥", color: "#f59e0b" },
                            { label: "Key Concepts", value: insights.top_concepts?.length || 0, icon: "🧠", color: "#06b6d4" },
                        ].map((s) => (
                            <div key={s.label} className="stat-card">
                                <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Weekly summary */}
                    <div className="card glass-bright" style={{ padding: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                            <div style={{ padding: 8, background: "rgba(124,58,237,0.15)", borderRadius: 10 }}>
                                <Lightbulb size={18} color="#a78bfa" />
                            </div>
                            <span style={{ fontWeight: 700, fontSize: 16 }}>Weekly Learning Summary</span>
                        </div>
                        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                            {insights.weekly_summary}
                        </p>
                    </div>

                    {/* Top Concepts */}
                    {insights.top_concepts?.length > 0 && (
                        <div className="card" style={{ padding: 24 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                <Brain size={16} color="#22d3ee" />
                                <span style={{ fontWeight: 700, fontSize: 15 }}>Top Concepts in Your Vault</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {insights.top_concepts.map((c: string, i: number) => (
                                    <div key={c} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <span style={{ fontSize: 12, color: "var(--text-muted)", width: 20, fontWeight: 700 }}>#{i + 1}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                                <span style={{ fontSize: 13, fontWeight: 600 }}>{c}</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${Math.max(20, 100 - i * 15)}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Suggested connections */}
                    {insights.suggested_connections?.length > 0 && (
                        <div className="card" style={{ padding: 24 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                <TrendingUp size={16} color="#f59e0b" />
                                <span style={{ fontWeight: 700, fontSize: 15 }}>Suggested Knowledge Connections</span>
                            </div>
                            {insights.suggested_connections.map((conn: any, i: number) => (
                                <div key={i} className="card" style={{ padding: 14, marginBottom: 10, background: "var(--bg-secondary)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                        <span className="tag">{conn.from?.slice(0, 20)}</span>
                                        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>↔</span>
                                        <span className="tag badge-cyan">{conn.to?.slice(0, 20)}</span>
                                    </div>
                                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{conn.reason}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
