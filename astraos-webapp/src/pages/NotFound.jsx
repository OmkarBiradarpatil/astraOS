import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
      }}
    >
      <h1
        style={{
          fontSize: "64px",
          fontWeight: 700,
          color: "var(--rose)",
          marginBottom: "16px",
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: "18px",
          color: "var(--muted)",
          marginBottom: "32px",
        }}
      >
        This sector of AstraOS is uncharted.
      </p>
      <Link
        to="/dashboard"
        style={{
          background: "var(--accent)",
          color: "#fff",
          textDecoration: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          fontWeight: 600,
        }}
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
