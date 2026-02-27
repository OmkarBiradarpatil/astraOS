"use client";
import { usePathname } from "next/navigation";
import { Search, Bell, Sparkles } from "lucide-react";
import Link from "next/link";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
    "/dashboard": { title: "Vault Dashboard", subtitle: "Your AI-powered knowledge overview" },
    "/upload": { title: "Upload Center", subtitle: "Add documents to your vault" },
    "/chat": { title: "AI Chat", subtitle: "Converse with your knowledge" },
    "/search": { title: "Semantic Search", subtitle: "Find anything with natural language" },
    "/graph": { title: "Knowledge Graph", subtitle: "Visualize your idea connections" },
    "/study": { title: "Study Mode", subtitle: "Flashcards, quizzes & summaries" },
    "/insights": { title: "AI Insights", subtitle: "Weekly learning intelligence" },
    "/settings": { title: "Settings", subtitle: "Configure your vault" },
};

export default function Topbar() {
    const pathname = usePathname();
    const base = "/" + (pathname.split("/")[1] || "dashboard");
    const info = pageTitles[base] || { title: "AstraOS Vault", subtitle: "" };

    return (
        <header className="topbar">
            <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
                    {info.title}
                </h1>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{info.subtitle}</p>
            </div>

            <Link href="/search">
                <button className="btn-icon" title="Search">
                    <Search size={16} />
                </button>
            </Link>

            <div style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)",
                borderRadius: 8, cursor: "default"
            }}>
                <Sparkles size={13} style={{ color: "#a78bfa" }} />
                <span style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600 }}>AI Ready</span>
            </div>
        </header>
    );
}
