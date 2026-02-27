"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, XCircle, Loader2, Trash2, AlertCircle } from "lucide-react";
import { uploadDocument, formatFileSize } from "@/lib/api";
import Link from "next/link";

interface QueuedFile {
    file: File;
    id?: string;
    status: "queued" | "uploading" | "done" | "error";
    error?: string;
    progress: number;
}

export default function UploadPage() {
    const [queue, setQueue] = useState<QueuedFile[]>([]);
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback((accepted: File[]) => {
        const newItems: QueuedFile[] = accepted.map((f) => ({
            file: f, status: "queued", progress: 0
        }));
        setQueue((q) => [...q, ...newItems]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            "text/plain": [".txt"],
            "text/markdown": [".md"],
        },
        multiple: true,
        maxSize: 50 * 1024 * 1024,
    });

    const removeFile = (idx: number) => {
        if (queue[idx].status === "uploading") return;
        setQueue((q) => q.filter((_, i) => i !== idx));
    };

    const uploadAll = async () => {
        if (uploading) return;
        setUploading(true);

        for (let i = 0; i < queue.length; i++) {
            if (queue[i].status === "done" || queue[i].status === "uploading") continue;
            setQueue((q) => q.map((item, idx) => idx === i ? { ...item, status: "uploading", progress: 30 } : item));
            try {
                const result = await uploadDocument(queue[i].file);
                setQueue((q) => q.map((item, idx) => idx === i ? { ...item, status: "done", id: result.id, progress: 100 } : item));
            } catch (err: any) {
                setQueue((q) => q.map((item, idx) => idx === i ? { ...item, status: "error", error: err.message, progress: 0 } : item));
            }
        }
        setUploading(false);
    };

    const doneCount = queue.filter((f) => f.status === "done").length;
    const pendingCount = queue.filter((f) => f.status === "queued").length;

    return (
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
                    Upload to Your <span className="gradient-text">Vault</span>
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                    Supports PDF, DOCX, TXT, and Markdown. AI will read, understand, and index your documents automatically.
                </p>
            </motion.div>

            {/* Drop Zone */}
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                <div
                    {...getRootProps()}
                    className={`upload-zone ${isDragActive ? "drag-over" : ""}`}
                    style={{ padding: "64px 32px", textAlign: "center", marginBottom: 24 }}
                >
                    <input {...getInputProps()} />
                    <motion.div animate={isDragActive ? { scale: 1.05 } : { scale: 1 }} transition={{ duration: 0.2 }}>
                        <div style={{
                            width: 72, height: 72, borderRadius: 20, margin: "0 auto 20px",
                            background: isDragActive ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.1)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            border: "1px solid rgba(124,58,237,0.3)",
                            transition: "all 0.3s"
                        }}>
                            <Upload size={32} color={isDragActive ? "#a78bfa" : "#7c3aed"} />
                        </div>
                        <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                            {isDragActive ? "Drop files here ✨" : "Drop files or click to upload"}
                        </p>
                        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>PDF, DOCX, TXT, MD · Max 50MB each</p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Supported formats */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
                {[
                    { ext: "PDF", color: "#ef4444", desc: "Research papers, books, reports" },
                    { ext: "DOCX", color: "#3b82f6", desc: "Word documents, notes" },
                    { ext: "TXT", color: "#10b981", desc: "Plain text files" },
                    { ext: "MD", color: "#a78bfa", desc: "Markdown notes" },
                ].map((f) => (
                    <div key={f.ext} style={{
                        padding: "8px 14px", borderRadius: 10, background: "var(--bg-card)",
                        border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8
                    }}>
                        <span style={{ fontWeight: 800, fontSize: 12, color: f.color }}>{f.ext}</span>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{f.desc}</span>
                    </div>
                ))}
            </div>

            {/* Upload queue */}
            <AnimatePresence>
                {queue.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <span style={{ fontWeight: 700, fontSize: 15 }}>
                                Queue <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({queue.length} files)</span>
                            </span>
                            <button
                                className="btn-primary"
                                onClick={uploadAll}
                                disabled={uploading || pendingCount === 0}
                                style={{ opacity: (uploading || pendingCount === 0) ? 0.6 : 1 }}
                            >
                                {uploading ? <><Loader2 size={14} className="animate-spin-slow" /> Uploading...</> : <>Upload All ({pendingCount})</>}
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {queue.map((item, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
                                    className="card" style={{ padding: 16 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ fontSize: 24 }}>
                                            {item.status === "done" ? "✅" : item.status === "error" ? "❌" : item.status === "uploading" ? "⏳" : "📄"}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {item.file.name}
                                            </div>
                                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                                                {formatFileSize(item.file.size)}
                                                {item.status === "done" && <span style={{ color: "#10b981", marginLeft: 8 }}>· AI indexing in progress...</span>}
                                                {item.status === "error" && <span style={{ color: "#ef4444", marginLeft: 8 }}>· {item.error}</span>}
                                            </div>
                                            {item.status === "uploading" && (
                                                <div className="progress-bar" style={{ marginTop: 6 }}>
                                                    <motion.div className="progress-fill" animate={{ width: `${item.progress}%` }} />
                                                </div>
                                            )}
                                        </div>
                                        {item.status !== "uploading" && (
                                            <button className="btn-icon" onClick={() => removeFile(idx)}>
                                                <Trash2 size={13} />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {doneCount > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card glass-bright"
                                style={{ marginTop: 20, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
                                <CheckCircle size={20} color="#10b981" />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>{doneCount} document{doneCount > 1 ? "s" : ""} uploaded!</div>
                                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>AI is indexing them now. Check the dashboard or start chatting.</div>
                                </div>
                                <Link href="/dashboard" style={{ marginLeft: "auto" }}>
                                    <button className="btn-primary" style={{ fontSize: 12 }}>View Dashboard</button>
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI pipeline info */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="card" style={{ marginTop: 36, padding: 24 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>🤖 What happens after upload?</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
                    {[
                        { step: "1", label: "Text Extraction", desc: "PyMuPDF reads every page", icon: "📖" },
                        { step: "2", label: "Smart Chunking", desc: "512-token semantic chunks", icon: "✂️" },
                        { step: "3", label: "AI Embedding", desc: "Vector representation", icon: "🧬" },
                        { step: "4", label: "Auto-Tagging", desc: "GPT extracts tags + summary", icon: "🏷️" },
                    ].map((s) => (
                        <div key={s.step} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.label}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.desc}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
