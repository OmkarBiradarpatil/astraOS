import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function VaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div className="main-content" style={{ flex: 1 }}>
                <Topbar />
                <main style={{ padding: "32px", minHeight: "calc(100vh - 64px)" }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
