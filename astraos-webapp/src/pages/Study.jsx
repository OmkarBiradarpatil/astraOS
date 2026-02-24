import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import AnimatedCounter from "../components/ui/AnimatedCounter";

const Study = () => {
  const context = useAppContext();
  const [duration, setDuration] = useState("");
  const [subject, setSubject] = useState("");

  if (!context)
    return (
      <div style={{ padding: "40px", color: "#fff" }}>
        Loading environment physics...
      </div>
    );
  const { studySessions, setStudySessions } = context;

  const addSession = (e) => {
    e.preventDefault();
    if (!duration || !subject) return;
    const session = {
      id: Date.now().toString(),
      subject,
      duration: parseFloat(duration),
      date: new Date().toISOString(),
    };
    setStudySessions([session, ...studySessions]);
    setDuration("");
    setSubject("");
  };

  const totalHours = studySessions.reduce(
    (acc, curr) => acc + curr.duration,
    0,
  );

  // Group by day for simple 7-day chart (mock logic based on real data length)
  const chartData = [
    { label: "M", height: 20 },
    { label: "T", height: 40 },
    { label: "W", height: Math.min(100, (totalHours / 10) * 100) }, // Just an example reactive bar
    { label: "T", height: 0 },
    { label: "F", height: 0 },
    { label: "S", height: 0 },
    { label: "S", height: 0 },
  ];

  return (
    <>
      <div
        className="welcome-banner"
        style={{
          marginBottom: "32px",
          animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <h1 className="greeting">Study Analytics</h1>
        <p className="status" style={{ fontSize: "15px" }}>
          Track your deep academic work and conceptual mastery.
        </p>
      </div>

      <div className="dashboard-grid">
        <Card delay={0.1}>
          <div className="card-header">
            <h3 className="card-title">Log Session</h3>
            <div
              className="card-icon"
              style={{
                background: "rgba(167, 139, 250, 0.1)",
                color: "var(--violet)",
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
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
          </div>
          <form
            onSubmit={addSession}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            <input
              type="text"
              placeholder="Subject (e.g. Calculus)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
                padding: "14px",
                borderRadius: "10px",
                color: "#fff",
                outline: "none",
                fontSize: "14px",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(167, 139, 250, 0.4)";
                e.target.style.boxShadow = "0 0 20px rgba(167, 139, 250, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
              }}
            />
            <input
              type="number"
              step="0.5"
              placeholder="Duration (hours)"
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
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(167, 139, 250, 0.4)";
                e.target.style.boxShadow = "0 0 20px rgba(167, 139, 250, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
              }}
            />
            <Button
              type="submit"
              style={{
                background: "var(--violet)",
                color: "#fff",
                boxShadow: "0 0 16px rgba(167,139,250,0.2)",
              }}
            >
              Log Session
            </Button>
          </form>
        </Card>

        <Card delay={0.2}>
          <div className="card-header">
            <h3 className="card-title">Analytics</h3>
            <div
              className="card-icon"
              style={{
                background: "rgba(52, 211, 153, 0.1)",
                color: "var(--green)",
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
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
          </div>
          <div
            className="stat-value"
            style={{
              marginTop: "12px",
              background: "linear-gradient(135deg, var(--text), var(--violet))",
              WebkitBackgroundClip: "text",
            }}
          >
            <AnimatedCounter value={totalHours} decimals={1} />
            <span className="stat-unit" style={{ fontSize: "16px" }}>
              hrs total
            </span>
          </div>

          <div
            style={{
              display: "flex",
              height: "100px",
              gap: "8px",
              alignItems: "flex-end",
              marginTop: "24px",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "10px",
            }}
          >
            {chartData.map((day, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "flex-end",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      height: `${Math.max(day.height, 4)}%`,
                      width: "100%",
                      borderRadius: "4px 4px 0 0",
                      background:
                        day.height > 0
                          ? "var(--violet)"
                          : "rgba(255,255,255,0.05)",
                      animation: `barGrow 0.7s ${0.3 + i * 0.05}s cubic-bezier(0.16, 1, 0.3, 1) both`,
                      transformOrigin: "bottom",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    color: "var(--muted)",
                    fontFamily: "Fira Code, monospace",
                  }}
                >
                  {day.label}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "24px",
              color: "var(--muted)",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "16px",
              fontWeight: 600,
            }}
          >
            Recent Sessions
          </div>
          <div className="task-list" style={{ gap: "6px" }}>
            {studySessions.slice(0, 4).map((s, i) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  animation: `fadeUp 0.4s ${0.4 + i * 0.1}s cubic-bezier(0.16, 1, 0.3, 1) both`,
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 500 }}>
                  {s.subject}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--muted)",
                    fontFamily: "Fira Code, monospace",
                    background: "rgba(255,255,255,0.04)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {s.duration}h
                </div>
              </div>
            ))}
            {studySessions.length === 0 && (
              <div
                style={{
                  color: "var(--muted)",
                  fontSize: "13px",
                  padding: "20px",
                  textAlign: "center",
                  border: "1px dashed var(--border)",
                  borderRadius: "8px",
                }}
              >
                No sessions logged yet.
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

export default Study;
