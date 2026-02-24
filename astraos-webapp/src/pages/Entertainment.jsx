import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import ProgressBar from "../components/ui/ProgressBar";

const Entertainment = () => {
  const context = useAppContext();
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");

  if (!context)
    return (
      <div style={{ padding: "40px", color: "#fff" }}>
        Loading environment physics...
      </div>
    );
  const { entertainmentData, setEntertainmentData } = context;

  const addMedia = (e) => {
    e.preventDefault();
    if (!title || !duration) return;
    const item = {
      id: Date.now().toString(),
      title,
      duration: parseFloat(duration),
      progress: 0,
      icon: "🎬",
    };
    setEntertainmentData({
      ...entertainmentData,
      items: [item, ...entertainmentData.items],
    });
    setTitle("");
    setDuration("");
  };

  const deleteMedia = (id) => {
    setEntertainmentData({
      ...entertainmentData,
      items: entertainmentData.items.filter((i) => i.id !== id),
    });
  };

  const totalWatchHours = entertainmentData.items.reduce(
    (acc, curr) => acc + curr.duration,
    0,
  );
  const LIMIT = 15; // 15 hours per week allowed
  const isBinge = totalWatchHours > LIMIT;

  return (
    <>
      <div
        className="welcome-banner"
        style={{
          marginBottom: "32px",
          animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <h1 className="greeting">Entertainment Hub</h1>
        <p className="status" style={{ fontSize: "15px" }}>
          Manage your downtime and ensure controlled media consumption.
        </p>
      </div>

      {isBinge && (
        <Card
          delay={0.1}
          style={{
            padding: "20px 24px",
            background: "rgba(244,63,94,0.08)",
            border: "1px solid rgba(244,63,94,0.3)",
            color: "var(--rose)",
            borderRadius: "12px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            animation: "pulseDanger 2s infinite",
          }}
          hover={false}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <strong
              style={{
                display: "block",
                fontSize: "15px",
                marginBottom: "4px",
              }}
            >
              Binge Alert Generated
            </strong>
            <span style={{ fontSize: "14px", opacity: 0.9 }}>
              You have exceeded your weekly entertainment allocation of {LIMIT}{" "}
              hours. Consider shifting focus to deep work.
            </span>
          </div>
        </Card>
      )}

      <div className="dashboard-grid">
        <Card delay={0.2} style={{ display: "flex", flexDirection: "column" }}>
          <div className="card-header">
            <h3 className="card-title">Add Media Log</h3>
            <div
              className="card-icon"
              style={{
                background: "rgba(251, 52, 98, 0.1)",
                color: "var(--rose)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
            </div>
          </div>
          <form
            onSubmit={addMedia}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginTop: "16px",
              flex: 1,
            }}
          >
            <input
              type="text"
              placeholder="Title (e.g. Severance)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
                padding: "14px",
                borderRadius: "10px",
                color: "#fff",
                outline: "none",
                fontSize: "14px",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(251, 52, 98, 0.4)";
                e.target.style.boxShadow = "0 0 20px rgba(251, 52, 98, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
              }}
            />
            <input
              type="number"
              step="0.5"
              placeholder="Duration Watched (hrs)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
                padding: "14px",
                borderRadius: "10px",
                color: "#fff",
                outline: "none",
                fontSize: "14px",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(251, 52, 98, 0.4)";
                e.target.style.boxShadow = "0 0 20px rgba(251, 52, 98, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
              }}
            />
            <Button
              type="submit"
              style={{
                marginTop: "auto",
                background: "var(--rose)",
                color: "#fff",
                boxShadow: "0 0 20px rgba(251, 52, 98, 0.2)",
              }}
            >
              Log Media
            </Button>
          </form>
        </Card>

        <Card delay={0.3}>
          <div className="card-header">
            <h3 className="card-title">Weekly Watch Time</h3>
            <div
              className="card-icon"
              style={{
                background: "rgba(0, 229, 255, 0.1)",
                color: "var(--accent)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div
            className="stat-value"
            style={{
              marginTop: "16px",
              display: "flex",
              alignItems: "baseline",
              gap: "8px",
            }}
          >
            <span
              style={{
                color: isBinge ? "var(--rose)" : "var(--accent)",
                transition: "color 0.5s",
              }}
            >
              <AnimatedCounter value={totalWatchHours} decimals={1} />
            </span>
            <span className="stat-unit" style={{ fontSize: "18px" }}>
              / {LIMIT} hrs
            </span>
          </div>

          <div style={{ marginTop: "20px" }}>
            <ProgressBar
              progress={Math.min(100, (totalWatchHours / LIMIT) * 100)}
              color={isBinge ? "var(--rose)" : "var(--accent)"}
              height="8px"
              noGlow={false}
            />
          </div>

          <div
            style={{
              marginTop: "32px",
              color: "var(--muted)",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "16px",
              fontWeight: 600,
            }}
          >
            Recent Consumption
          </div>

          <div className="task-list" style={{ gap: "8px" }}>
            {entertainmentData.items.map((m, i) => (
              <div
                key={m.id}
                className="task-item"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  animation: `fadeUp 0.4s ${0.3 + i * 0.05}s cubic-bezier(0.16, 1, 0.3, 1) both`,
                }}
              >
                <div className="task-content">
                  <div
                    className="task-text"
                    style={{ fontSize: "14px", fontWeight: 500 }}
                  >
                    {m.title}
                  </div>
                  <div className="task-tag" style={{ marginTop: "4px" }}>
                    {m.duration} hrs logged
                  </div>
                </div>
                <button
                  onClick={() => deleteMedia(m.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--muted)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--rose)";
                    e.currentTarget.style.background = "rgba(251,52,98,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--muted)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
            {entertainmentData.items.length === 0 && (
              <div
                style={{
                  color: "var(--muted)",
                  fontSize: "13px",
                  textAlign: "center",
                  padding: "20px",
                  border: "1px dashed var(--border)",
                  borderRadius: "8px",
                }}
              >
                No media logged. Enjoy the real world.
              </div>
            )}
          </div>
        </Card>
      </div>
      <style>{`
        @keyframes pulseDanger {
          0% { box-shadow: 0 0 0 0 rgba(244,63,94,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(244,63,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(244,63,94,0); }
        }
      `}</style>
    </>
  );
};

export default Entertainment;
