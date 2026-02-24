import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = signup(name, email, password);
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
          style={{ marginBottom: "24px", justifyContent: "center" }}
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
          Create Account
        </h2>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "13px",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Set up your personal workspace today.
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
          onSubmit={handleSignup}
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
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Arjun Mehta"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                padding: "10px 14px",
                borderRadius: "8px",
                color: "var(--text)",
                fontSize: "13px",
                outline: "none",
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
            <input
              type="password"
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
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              }}
            />
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
            }}
          >
            Create Account
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
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
