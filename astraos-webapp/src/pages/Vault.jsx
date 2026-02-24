import React, { useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Card from "../components/ui/Card";

const Vault = () => {
  const context = useAppContext();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!context)
    return (
      <div style={{ padding: "40px", color: "#fff" }}>
        Loading environment physics...
      </div>
    );
  const { vaultFiles, setVaultFiles } = context;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      addFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      addFile(file);
    }
  };

  const addFile = (file) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    let icon = "📄";
    let color = "rgba(0, 229, 255, 0.1)"; // Cyan default

    // Simple icon mapping
    if (["png", "jpg", "jpeg", "gif", "svg"].includes(ext)) {
      icon = "🖼️";
      color = "rgba(167, 139, 250, 0.1)";
    }
    if (["txt", "md", "doc", "docx"].includes(ext)) {
      icon = "📝";
      color = "rgba(52, 211, 153, 0.1)";
    }
    if (["pdf"].includes(ext)) {
      icon = "📕";
      color = "rgba(251, 52, 98, 0.1)";
    }
    if (["zip", "rar", "7z"].includes(ext)) {
      icon = "📦";
      color = "rgba(251, 191, 36, 0.1)";
    }

    const newFile = {
      id: Date.now().toString(),
      name: file.name,
      date: new Date().toISOString(),
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      icon,
      color,
    };
    setVaultFiles([newFile, ...vaultFiles]);
  };

  const deleteFile = (id) => {
    setVaultFiles(vaultFiles.filter((f) => f.id !== id));
  };

  return (
    <>
      <div
        className="welcome-banner"
        style={{
          marginBottom: "32px",
          animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <h1 className="greeting">Data Vault</h1>
        <p className="status" style={{ fontSize: "15px" }}>
          Securely manage your encrypted local files and documents. Virtual
          storage mapping.
        </p>
      </div>

      <Card
        delay={0.1}
        style={{ marginBottom: "24px", padding: 0, overflow: "hidden" }}
        hover={false}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <div
          className={`dropzone ${isDragging ? "active" : ""}`}
          onClick={() => fileInputRef.current.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? "var(--border-bright)" : "var(--border)"}`,
            borderRadius: "14px",
            padding: "50px 20px",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            background: isDragging ? "var(--accent-glow)" : "transparent",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "0", // Overriding global dropzone padding if it exists
          }}
          onMouseEnter={(e) => {
            if (!isDragging) {
              e.currentTarget.style.borderColor = "rgba(0, 229, 255, 0.3)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isDragging) {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "16px",
              background: "rgba(0, 229, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              boxShadow: isDragging ? "0 0 30px rgba(0,229,255,0.2)" : "none",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: isDragging ? "scale(1.1)" : "scale(1)",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <h3
            style={{
              fontSize: "16px",
              marginBottom: "8px",
              fontFamily: "Sora, sans-serif",
            }}
          >
            Click or drag files to encrypt
          </h3>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>
            Simulated storage mapping metadata exclusively
          </p>
        </div>
      </Card>

      <div
        style={{
          marginTop: "32px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3 style={{ fontSize: "15px", fontFamily: "Sora, sans-serif" }}>
          Encrypted Files
        </h3>
        <span
          style={{
            fontSize: "11px",
            color: "var(--muted)",
            fontFamily: "Fira Code, monospace",
            padding: "4px 8px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "6px",
          }}
        >
          {vaultFiles.length} item{vaultFiles.length !== 1 ? "s" : ""}
        </span>
      </div>

      {vaultFiles.length === 0 ? (
        <Card
          delay={0.2}
          style={{
            padding: "60px 20px",
            textAlign: "center",
            color: "var(--muted)",
            border: "1px dashed var(--border)",
            background: "transparent",
          }}
          hover={false}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            style={{ margin: "0 auto 16px", opacity: 0.3 }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
          Vault is empty.
        </Card>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {vaultFiles.map((file, i) => (
            <div
              key={file.id}
              className="vault-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "16px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                animation: `fadeUp 0.5s ${0.2 + i * 0.05}s cubic-bezier(0.16, 1, 0.3, 1) both`,
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "var(--border-hover)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  background: file.color || "rgba(0,229,255,0.1)",
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  flexShrink: 0,
                }}
              >
                {file.icon || "📄"}
              </div>

              <div
                className="vault-info"
                style={{ flex: 1, minWidth: 0, paddingRight: "10px" }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    color: "var(--text)",
                  }}
                >
                  {file.name}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--muted)",
                    marginTop: "4px",
                    fontFamily: "Fira Code, monospace",
                  }}
                >
                  {file.size} • {new Date(file.date).toLocaleDateString()}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFile(file.id);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--muted)",
                  padding: "8px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  opacity: 0.6,
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(251,52,98,0.1)";
                  e.currentTarget.style.color = "var(--rose)";
                  e.currentTarget.style.opacity = 1;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--muted)";
                  e.currentTarget.style.opacity = 0.6;
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Vault;
