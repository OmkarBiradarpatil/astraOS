import React from "react";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import ProgressBar from "../components/ui/ProgressBar";
import CircularMeter from "../components/ui/CircularMeter";

const Dashboard = () => {
  const context = useAppContext();
  const auth = useAuth();

  if (!context || !auth) {
    return (
      <div style={{ padding: "40px", color: "#fff" }}>
        Loading environment physics...
      </div>
    );
  }

  const { tasks, healthData } = context;
  const { user } = auth;

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <>
      <div
        className="welcome-banner"
        style={{
          marginBottom: "24px",
          animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <h1 className="greeting">
          Welcome back, {user?.name?.split(" ")[0] || "User"}.
        </h1>
        <p className="status">
          Optimal system conditions. {tasks.filter((t) => !t.completed).length}{" "}
          items require attention.
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Productivity Card */}
        <Card delay={0.1} className="stat-card">
          <div className="card-header">
            <h3 className="card-title">Tasks</h3>
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
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </div>
          </div>
          <div className="stat-value" style={{ marginBottom: "16px" }}>
            <AnimatedCounter value={completedTasks} />
            <span className="stat-unit" style={{ fontSize: "18px" }}>
              /{totalTasks}
            </span>
          </div>
          <ProgressBar progress={taskProgress} />

          <div className="task-list" style={{ marginTop: "24px" }}>
            {tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className={`task-item ${task.completed ? "done" : ""}`}
              >
                <div
                  className="task-check"
                  style={{ width: 18, height: 18, flexShrink: 0 }}
                >
                  <svg
                    className="check-icon"
                    style={{
                      display: task.completed ? "block" : "none",
                      width: 12,
                      height: 12,
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div
                  className="task-content"
                  style={{ flex: 1, overflow: "hidden" }}
                >
                  <div
                    className="task-text"
                    style={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    {task.text}
                  </div>
                  <div
                    className="task-tag"
                    style={{ display: "inline-block", marginTop: "4px" }}
                  >
                    {task.tag}
                  </div>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div style={{ fontSize: 13, color: "var(--muted)" }}>
                No tasks available.
              </div>
            )}
          </div>
        </Card>

        {/* Study Focus */}
        <Card delay={0.2} className="stat-card">
          <div className="card-header">
            <h3 className="card-title">Study Focus</h3>
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
          <div className="stat-value">
            <AnimatedCounter value={38.5} decimals={1} />
            <span className="stat-unit" style={{ fontSize: "18px" }}>
              hrs
            </span>
          </div>
          <div
            className="chart-container"
            style={{
              marginTop: "32px",
              display: "flex",
              height: "140px",
              gap: "8px",
              alignItems: "flex-end",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "10px",
            }}
          >
            {/* Creating mock bars for dashboard display */}
            {[
              { h: 40, l: "M" },
              { h: 65, l: "T" },
              { h: 85, l: "W" },
              { h: 100, l: "T", a: true },
              { h: 50, l: "F" },
              { h: 30, l: "S" },
              { h: 25, l: "S" },
            ].map((day, i) => (
              <div
                key={i}
                className="bar-day"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
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
                    className={`bar ${day.a ? "active" : ""}`}
                    style={{
                      height: `${day.h}%`,
                      width: "100%",
                      borderRadius: "4px 4px 0 0",
                    }}
                  />
                </div>
                <span className="bar-label">{day.l}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Health */}
        <Card delay={0.3} className="stat-card">
          <div className="card-header">
            <h3 className="card-title">Health</h3>
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
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
          </div>

          <div className="health-grid" style={{ marginBottom: "24px" }}>
            <div
              className="health-item"
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <div style={{ color: "#60a5fa", marginBottom: "8px" }}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
              <div className="health-item-val">
                <AnimatedCounter value={healthData.water || 0} decimals={1} />L
              </div>
              <div className="health-item-label">Water Intake</div>
            </div>

            <div
              className="health-item"
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <div style={{ color: "#c084fc", marginBottom: "8px" }}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </div>
              <div className="health-item-val">
                <AnimatedCounter value={healthData.sleep || 0} decimals={1} />h
              </div>
              <div className="health-item-label">Sleep Data</div>
            </div>
          </div>

          <div
            className="energy-circle"
            style={{
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
            }}
          >
            <CircularMeter
              progress={94}
              size={64}
              strokeWidth={6}
              color="var(--gold)"
            >
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 800,
                  color: "var(--text)",
                }}
              >
                94
              </span>
            </CircularMeter>
            <div>
              <div
                className="energy-val"
                style={{ fontSize: "18px", fontWeight: 700 }}
              >
                System Energy
              </div>
              <div
                className="energy-label"
                style={{
                  fontSize: "12px",
                  color: "var(--muted)",
                  marginTop: "4px",
                }}
              >
                Optimal Performance
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
