import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", color: "#fff", textAlign: "center" }}>
          <h1 style={{ color: "var(--rose)", marginBottom: "16px" }}>
            Dashboard Error
          </h1>
          <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
            Something went wrong loading the interface.
          </p>
          <pre
            style={{
              background: "rgba(255,255,255,0.05)",
              padding: "16px",
              borderRadius: "8px",
              textAlign: "left",
              overflow: "auto",
            }}
          >
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => (window.location.href = "/")}
            style={{
              marginTop: "24px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Reload Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
