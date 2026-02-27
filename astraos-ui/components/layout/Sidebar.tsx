"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Upload, MessageSquare, Search, GitFork,
    BookOpen, Lightbulb, Settings, Zap, ChevronRight
} from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/upload", icon: Upload, label: "Upload Center" },
    { href: "/chat", icon: MessageSquare, label: "AI Chat" },
    { href: "/search", icon: Search, label: "Semantic Search" },
    { href: "/graph", icon: GitFork, label: "Knowledge Graph" },
    { href: "/study", icon: BookOpen, label: "Study Mode" },
    { href: "/insights", icon: Lightbulb, label: "Insights" },
];

export default function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className="sidebar">
            {/* Logo */}
            <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 16px rgba(124,58,237,0.4)"
                    }}>
                        <Zap size={18} color="white" fill="white" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.5px", color: "var(--text-primary)" }}>
                            Astra<span className="gradient-text">OS</span>
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
                            AI Vault
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: "12px 12px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1.2px", textTransform: "uppercase", padding: "8px 6px", marginBottom: 4 }}>
                    Vault
                </div>
                {navItems.map(({ href, icon: Icon, label }) => {
                    const active = pathname === href || pathname.startsWith(href + "/");
                    return (
                        <Link key={href} href={href} className={`nav-item ${active ? "active" : ""}`}>
                            <Icon size={16} />
                            <span style={{ flex: 1 }}>{label}</span>
                            {active && <ChevronRight size={14} style={{ opacity: 0.5 }} />}
                        </Link>
                    );
                })}

                <div style={{ height: 1, background: "var(--border)", margin: "12px 0" }} />
                <Link href="/settings" className={`nav-item ${pathname === "/settings" ? "active" : ""}`}>
                    <Settings size={16} />
                    <span>Settings</span>
                </Link>
            </nav>

            {/* Footer */}
            <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: "#10b981", boxShadow: "0 0 6px #10b981"
                    }} />
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>AI Vault Online</span>
                </div>
            </div>
        </aside>
    );
}
