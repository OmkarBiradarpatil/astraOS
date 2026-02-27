"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { fetchKnowledgeGraph } from "@/lib/api";
import { Network, Loader2, Info } from "lucide-react";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

export default function GraphPage() {
    const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] }>({ nodes: [], links: [] });
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<any>(null);
    const graphRef = useRef<any>(null);

    useEffect(() => {
        fetchKnowledgeGraph()
            .then((data) => {
                const nodes = (data.nodes || []).map((n: any) => ({ ...n, val: n.size || 10 }));
                const links = (data.edges || []).map((e: any) => ({
                    source: e.source, target: e.target, label: e.label, value: e.weight
                }));
                setGraphData({ nodes, links });
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const colorMap: Record<string, string> = {
        document: "#7c3aed",
        concept: "#06b6d4",
        tag: "#f59e0b",
    };

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Knowledge <span className="gradient-text">Graph</span></h2>
                        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Visual map of how your ideas, documents, and concepts connect.</p>
                    </div>
                    {/* Legend */}
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        {[["#7c3aed", "Document"], ["#06b6d4", "Concept"], ["#f59e0b", "Tag"]].map(([c, l]) => (
                            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{l}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 500, gap: 12 }}>
                    <Loader2 size={24} color="#7c3aed" style={{ animation: "spin 1s linear infinite" }} />
                    <span style={{ color: "var(--text-muted)" }}>Building knowledge graph...</span>
                </div>
            ) : graphData.nodes.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "80px 24px" }}>
                    <div style={{ fontSize: 64, marginBottom: 20 }}>🕸️</div>
                    <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Graph is empty</div>
                    <p style={{ color: "var(--text-muted)" }}>Upload documents to build your knowledge graph.</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 300px" : "1fr", gap: 20 }}>
                    <div style={{ background: "var(--bg-card)", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden", height: 600 }}>
                        <ForceGraph2D
                            ref={graphRef}
                            graphData={graphData}
                            backgroundColor="#07070f"
                            nodeLabel="label"
                            nodeColor={(n: any) => colorMap[n.type] || "#7c3aed"}
                            nodeVal={(n: any) => n.val}
                            linkColor={() => "rgba(124,58,237,0.25)"}
                            linkWidth={1}
                            linkDirectionalParticles={1}
                            linkDirectionalParticleWidth={2}
                            linkDirectionalParticleColor={() => "#7c3aed"}
                            onNodeClick={(node: any) => setSelected(selected?.id === node.id ? null : node)}
                            nodeCanvasObject={(node: any, ctx, globalScale) => {
                                const label = node.label || "";
                                const fontSize = Math.max(8, 12 / globalScale);
                                const r = Math.sqrt(node.val) * 2;
                                ctx.beginPath();
                                ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
                                ctx.fillStyle = node.id === selected?.id ? "#ffffff" : (colorMap[node.type] || "#7c3aed");
                                ctx.fill();
                                if (globalScale > 0.8) {
                                    ctx.fillStyle = "#f1f0ff";
                                    ctx.font = `${fontSize}px Inter, sans-serif`;
                                    ctx.textAlign = "center";
                                    ctx.fillText(label.slice(0, 20), node.x, node.y + r + fontSize + 2);
                                }
                            }}
                        />
                    </div>
                    {selected && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ padding: 20, alignSelf: "start" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <span className={`tag ${selected.type === "concept" ? "badge-cyan" : selected.type === "tag" ? "badge-amber" : ""}`}>{selected.type}</span>
                                <button className="btn-icon" onClick={() => setSelected(null)} style={{ fontSize: 16 }}>×</button>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{selected.label}</div>
                            {selected.metadata?.summary && (
                                <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>{selected.metadata.summary}</p>
                            )}
                            {selected.metadata?.tags?.length > 0 && (
                                <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                                    {selected.metadata.tags.map((t: string) => <span key={t} className="tag">{t}</span>)}
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}
