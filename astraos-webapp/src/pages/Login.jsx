import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const result = login(email, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
        <div
          className="card-header"
          style={{ marginBottom: "30px", justifyContent: "center" }}
        >
          <div className="logo" style={{ border: "none", padding: 0 }}>
            <div
              className="logo-icon"
              style={{ width: 40, height: 40, fontSize: "16px" }}
            >
              Ao
            </div>
            <div className="logo-name" style={{ fontSize: "20px" }}>
              Astra<span>OS</span>
            </div>
          </div>
        </div>
        <h2
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "22px",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          Welcome Back
        </h2>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "13px",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Enter your credentials to access your workspace.
        </p>

        {error && (
          <div
            style={{
              background: "rgba(244,63,94,0.1)",
              border: "1px solid rgba(244,63,94,0.3)",
              color: "var(--rose)",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "12.5px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                color: "var(--muted)",
                fontFamily: "'Fira Code', monospace",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                padding: "10px 14px",
                borderRadius: "8px",
                color: "var(--text)",
                fontSize: "13px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                color: "var(--muted)",
                fontFamily: "'Fira Code', monospace",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  color: "var(--text)",
                  fontSize: "13px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "4px",
            }}
          >
            <input
              type="checkbox"
              id="remember"
              style={{ cursor: "pointer" }}
            />
            <label
              htmlFor="remember"
              style={{
                fontSize: "12px",
                color: "var(--muted)",
                cursor: "pointer",
              }}
            >
              Remember me
            </label>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "13.5px",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "8px",
              transition: "opacity 0.2s",
            }}
          >
            Sign In to Workspace
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "12px",
            color: "var(--muted)",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
