import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "var(--bg)",
        position: "relative",
      }}
    >
      {/* Ambient background layers */}
      <div className="ambient-layer ambient-mesh" />
      <div className="ambient-layer ambient-glow" />
      <div className="ambient-layer ambient-grain" />

      <Sidebar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Topbar />
        <main
          className="content"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px",
            color: "var(--text)",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
