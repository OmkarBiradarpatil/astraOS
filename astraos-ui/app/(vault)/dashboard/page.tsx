"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchVaultStats, fetchDocuments, formatFileSize, formatDate, getFileIcon, getStatusColor } from "@/lib/api";
import { FileText, Brain, Search, Tag, Zap, TrendingUp, BookOpen, Network } from "lucide-react";
import Link from "next/link";

interface Stats {
    total_documents: number;
    ready_documents: number;
    total_chunks: number;
    total_words: number;
    unique_tags: number;
    unique_concepts: number;
    top_tags: string[];
    top_concepts: string[];
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [docs, setDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([fetchVaultStats(), fetchDocuments()])
            .then(([s, d]) => { setStats(s); setDocs(d.documents || []); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const statCards = stats ? [
        { label: "Documents", value: stats.total_documents, icon: FileText, color: "#7c3aed", sub: `${stats.ready_documents} ready` },
        { label: "Indexed Chunks", value: stats.total_chunks.toLocaleString(), icon: Brain, color: "#06b6d4", sub: "vector embedded" },
        { label: "Words Stored", value: (stats.total_words / 1000).toFixed(1) + "K", icon: TrendingUp, color: "#10b981", sub: "knowledge indexed" },
        { label: "Concepts", value: stats.unique_concepts, icon: Network, color: "#f59e0b", sub: `${stats.unique_tags} tags` },
    ] : [];

    return (
        <div>
            {/* Hero greeting */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>
                    Welcome to your{" "}
                    <span className="gradient-text">Second Brain</span> ✦
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
                    Your AI vault has indexed your knowledge and is ready to assist.
                </p>
            </motion.div>

            {/* Quick actions */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
                {[
                    { href: "/upload", icon: <Zap size={15} />, label: "Upload Document", primary: true },
                    { href: "/chat", icon: <Brain size={15} />, label: "Ask AI", primary: false },
                    { href: "/search", icon: <Search size={15} />, label: "Search Vault", primary: false },
                    { href: "/graph", icon: <Network size={15} />, label: "View Graph", primary: false },
                ].map((a) => (
                    <Link key={a.href} href={a.href}>
                        <button className={a.primary ? "btn-primary" : "btn-secondary"}>
                            {a.icon} {a.label}
                        </button>
                    </Link>
                ))}
            </motion.div>

            {/* Stats Grid */}
            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="skeleton" style={{ height: 110 }} />
                    ))}
                </div>
            ) : (
                <motion.div variants={container} initial="hidden" animate="show"
                    style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 36 }}>
                    {statCards.map((s) => (
                        <motion.div key={s.label} variants={item} className="stat-card">
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                                <div style={{ padding: 8, borderRadius: 10, background: s.color + "20" }}>
                                    <s.icon size={18} color={s.color} />
                                </div>
                            </div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginTop: 4 }}>{s.label}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{s.sub}</div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Recent Documents + Concepts side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
                {/* Recent docs */}
                <div>
                    <div className="section-header">
                        <div>
                            <div className="section-title" style={{ fontSize: 18 }}>Recent Documents</div>
                            <div className="section-subtitle">Latest additions to your vault</div>
                        </div>
                        <Link href="/upload"><button className="btn-primary" style={{ fontSize: 13, padding: "7px 14px" }}>+ Upload</button></Link>
                    </div>

                    {docs.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>🧠</div>
                            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>Your vault is empty</div>
                            <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>Upload your first document to start building your Second Brain.</p>
                            <Link href="/upload"><button className="btn-primary">Upload First Document</button></Link>
                        </motion.div>
                    ) : (
                        <motion.div variants={container} initial="hidden" animate="show" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {docs.slice(0, 8).map((doc) => (
                                <motion.div key={doc.id} variants={item} className="card card-interactive"
                                    style={{ padding: 16, display: "flex", gap: 14, alignItems: "flex-start" }}>
                                    <div style={{ fontSize: 28, lineHeight: 1 }}>{getFileIcon(doc.file_type)}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                            <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {doc.original_name}
                                            </span>
                                            <span className={`tag ${getStatusColor(doc.status)}`}>{doc.status}</span>
                                        </div>
                                        {doc.summary && (
                                            <p style={{
                                                fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 8,
                                                overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical"
                                            }}>
                                                {doc.summary}
                                            </p>
                                        )}
                                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                                            {doc.tags?.slice(0, 4).map((t: string) => (
                                                <span key={t} className="tag">{t}</span>
                                            ))}
                                        </div>
                                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                                            {formatFileSize(doc.file_size)} · {doc.chunk_count} chunks · {formatDate(doc.created_at)}
                                        </div>
                                    </div>
                                    <Link href={`/chat?doc=${doc.id}`}>
                                        <button className="btn-icon" title="Chat with this doc">
                                            <Brain size={14} />
                                        </button>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* Sidebar: top concepts + tags */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Top Concepts */}
                    <div className="card" style={{ padding: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                            <Brain size={16} color="#a78bfa" />
                            <span style={{ fontWeight: 700, fontSize: 14 }}>Top Concepts</span>
                        </div>
                        {stats?.top_concepts?.length ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {stats.top_concepts.slice(0, 8).map((c, i) => (
                                    <div key={c} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontSize: 11, color: "var(--text-muted)", width: 16 }}>{i + 1}</span>
                                        <div style={{ flex: 1, height: 4, background: "var(--bg-secondary)", borderRadius: 2, overflow: "hidden" }}>
                                            <div style={{
                                                height: "100%", width: `${100 - i * 10}%`,
                                                background: `linear-gradient(90deg, var(--purple), var(--cyan))`, borderRadius: 2
                                            }} />
                                        </div>
                                        <span style={{ fontSize: 12, color: "var(--text-secondary)", minWidth: 80, textAlign: "right" }}>
                                            {c.length > 14 ? c.slice(0, 14) + "…" : c}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Upload documents to see concepts</p>
                        )}
                    </div>

                    {/* Quick actions tile */}
                    <div className="card glass-bright" style={{ padding: 20 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--text-primary)" }}>✨ AI Features</div>
                        {[
                            { href: "/study", icon: BookOpen, label: "Study Mode", desc: "Flashcards & quizzes" },
                            { href: "/graph", icon: Network, label: "Knowledge Graph", desc: "Idea connections" },
                            { href: "/insights", icon: Zap, label: "AI Insights", desc: "Weekly intelligence" },
                        ].map(({ href, icon: Icon, label, desc }) => (
                            <Link key={href} href={href} style={{ textDecoration: "none" }}>
                                <div className="nav-item" style={{ borderRadius: 8, padding: "8px 10px", marginBottom: 4 }}>
                                    <Icon size={14} />
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{label}</div>
                                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{desc}</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
