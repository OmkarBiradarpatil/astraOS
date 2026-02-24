import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { tasks } = useAppContext();

  const pendingTasks = tasks.filter((t) => !t.completed).length;

  const getClassName = (path) => {
    return `nav-item ${location.pathname.includes(path) ? "active" : ""}`;
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">Ao</div>
        <div className="logo-name">
          Astra<span>OS</span>
        </div>
      </div>
      <nav className="nav">
        <div className="nav-section">Main</div>
        <Link to="/dashboard" className={getClassName("/dashboard")}>
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>Dashboard</span>
        </Link>
        <Link to="/tasks" className={getClassName("/tasks")}>
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <span>Tasks</span>
          {pendingTasks > 0 && (
            <span className="nav-badge">{pendingTasks}</span>
          )}
        </Link>
        <Link to="/study" className={getClassName("/study")}>
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span>Study</span>
        </Link>
        <Link to="/focustube" className={getClassName("/focustube")}>
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
          <span>FocusTube</span>
        </Link>
        <div className="nav-section">Personal</div>
        <Link to="/vault" className={getClassName("/vault")}>
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <span>Vault</span>
        </Link>
        <Link to="/health" className={getClassName("/health")}>
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>Health</span>
        </Link>
        <Link to="/entertainment" className={getClassName("/entertainment")}>
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span>Entertainment</span>
        </Link>
        <Link to="/settings" className={getClassName("/settings")}>
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93l-1.41 1.41" />
            <path d="M4.93 19.07l1.41-1.41" />
            <path d="M19.07 19.07l-1.41-1.41" />
            <path d="M4.93 4.93l1.41 1.41" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
          </svg>
          <span>Settings</span>
        </Link>
      </nav>
      <div className="sidebar-footer">
        <Link
          to="/settings"
          className="user-card"
          style={{ textDecoration: "none" }}
        >
          <div className="avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || "User"}</div>
            <div className="user-role">
              {user?.email?.split("@")[0]}@astraos
            </div>
          </div>
          <div className="user-status"></div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
