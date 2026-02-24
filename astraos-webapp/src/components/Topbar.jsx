import React from "react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";

const Topbar = () => {
  const { user } = useAuth();
  const d = new Date();

  return (
    <header className="topbar">
      <div className="topbar-title">Dashboard</div>
      <div className="topbar-subtitle">alpha / v2.4</div>
      <div className="topbar-search">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6B7A99"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" placeholder="Search anything..." />
        <div className="search-hint">⌘K</div>
      </div>
      <div className="topbar-actions">
        <div className="date-chip">
          {d.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className="icon-btn">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <div className="notif-dot"></div>
        </div>
        <div className="icon-btn">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
