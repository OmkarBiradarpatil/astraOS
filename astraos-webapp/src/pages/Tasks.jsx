import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const MemoizedTaskItem = React.memo(({ task, toggleTask, deleteTask }) => (
  <div
    className={`task-item ${task.completed ? "done" : ""}`}
    style={{
      display: "flex",
      alignItems: "center",
      padding: "14px 18px",
      border: "none",
      borderBottom: "1px solid rgba(255,255,255,0.03)",
      borderRadius: 0,
      background: "transparent",
    }}
  >
    <div
      onClick={() => toggleTask(task.id)}
      className="task-check"
      role="checkbox"
      aria-checked={task.completed}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") toggleTask(task.id);
      }}
      style={{
        width: 20,
        height: 20,
        borderRadius: 6,
        background: task.completed ? "var(--accent)" : "transparent",
        borderColor: task.completed ? "var(--accent)" : "var(--muted)",
        boxShadow: task.completed ? "0 0 12px rgba(0, 229, 255, 0.3)" : "none",
        marginRight: 16,
        cursor: "pointer",
      }}
    >
      <svg
        className="check-icon"
        style={{
          display: task.completed ? "block" : "none",
          width: 14,
          height: 14,
          color: "#000",
          animation: "popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
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
      style={{
        flex: 1,
        cursor: "pointer",
        opacity: task.completed ? 0.6 : 1,
        transition: "opacity 0.3s",
      }}
      onClick={() => toggleTask(task.id)}
    >
      <div
        className="task-text"
        style={{
          fontSize: "14px",
          textDecoration: task.completed ? "line-through" : "none",
          fontWeight: 500,
        }}
      >
        {task.text}
      </div>
      <div
        className="task-tag"
        style={{ borderLeftColor: task.priority, marginTop: "6px" }}
      >
        {task.tag}
      </div>
    </div>
    <button
      onClick={() => deleteTask(task.id)}
      aria-label={`Delete task ${task.text}`}
      style={{
        background: "rgba(251,52,98,0)",
        border: "1px solid transparent",
        color: "var(--muted)",
        cursor: "pointer",
        padding: "10px",
        borderRadius: "8px",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(251,52,98,0.1)";
        e.currentTarget.style.color = "var(--rose)";
        e.currentTarget.style.borderColor = "rgba(251,52,98,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(251,52,98,0)";
        e.currentTarget.style.color = "var(--muted)";
        e.currentTarget.style.borderColor = "transparent";
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
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    </button>
  </div>
));

const Tasks = () => {
  const context = useAppContext();
  const [newTask, setNewTask] = useState("");
  const [tag, setTag] = useState("");
  const [filter, setFilter] = useState("all");

  if (!context)
    return (
      <div style={{ padding: "40px", color: "#fff" }}>
        Loading environment physics...
      </div>
    );
  const { tasks, setTasks } = context;

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const t = {
      id: Date.now().toString(),
      text: newTask,
      tag: tag || "task",
      priority: "#00E5FF", // Update to new accent color token
      completed: false,
    };
    setTasks([...tasks, t]);
    setNewTask("");
    setTag("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  return (
    <>
      <div
        className="welcome-banner"
        style={{
          marginBottom: "32px",
          animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <h1 className="greeting">Tasks & Objectives</h1>
        <p className="status" style={{ fontSize: "15px" }}>
          Manage your daily operations and long-term goals.
        </p>
      </div>

      <Card
        delay={0.1}
        style={{ marginBottom: "28px", background: "rgba(255,255,255,0.01)" }}
      >
        <form
          onSubmit={addTask}
          style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
        >
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={{
              flex: 1,
              minWidth: "250px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border)",
              padding: "14px 20px",
              borderRadius: "10px",
              color: "#fff",
              outline: "none",
              fontSize: "14px",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(0, 229, 255, 0.4)";
              e.target.style.boxShadow = "0 0 20px rgba(0, 229, 255, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border)";
              e.target.style.boxShadow = "none";
            }}
          />
          <input
            type="text"
            placeholder="Tag (e.g. dev)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            style={{
              width: "140px",
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
              e.target.style.borderColor = "rgba(0, 229, 255, 0.4)";
              e.target.style.boxShadow = "0 0 20px rgba(0, 229, 255, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border)";
              e.target.style.boxShadow = "none";
            }}
          />
          <Button type="submit" variant="primary">
            Add Task
          </Button>
        </form>
      </Card>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
          animation: "fadeUp 0.5s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        {["all", "pending", "completed"].map((f) => (
          <button
            key={f}
            aria-label={`Filter by ${f}`}
            onClick={() => setFilter(f)}
            style={{
              background:
                filter === f
                  ? "var(--accent-glow-strong)"
                  : "rgba(255,255,255,0.03)",
              color: filter === f ? "var(--accent)" : "var(--muted)",
              border: `1px solid ${filter === f ? "var(--border-bright)" : "var(--border)"}`,
              padding: "8px 20px",
              borderRadius: "100px",
              textTransform: "capitalize",
              fontSize: "13.5px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow:
                filter === f ? "0 0 20px rgba(0, 229, 255, 0.1)" : "none",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <Card delay={0.3} style={{ padding: "8px" }} hover={false}>
        {filteredTasks.length === 0 ? (
          <div
            style={{
              padding: "60px 40px",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: "14px",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              style={{ margin: "0 auto 16px", opacity: 0.5 }}
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            No tasks found in this view.
          </div>
        ) : (
          <div className="task-list" style={{ gap: "4px" }}>
            {filteredTasks.map((task) => (
              <MemoizedTaskItem
                key={task.id}
                task={task}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
              />
            ))}
          </div>
        )}
      </Card>
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Tasks;
