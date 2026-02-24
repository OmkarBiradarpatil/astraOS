import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const Settings = () => {
  const context = useAppContext();
  const auth = useAuth();
  const [username, setUsername] = useState(auth?.user?.name || "");
  const [showToast, setShowToast] = useState(false);

  if (!context || !auth)
    return (
      <div style={{ padding: "40px", color: "#fff" }}>
        Loading environment physics...
      </div>
    );
  const { resetAllData } = context;
  const { logout, changeUsername } = auth;

  const handleSave = (e) => {
    e.preventDefault();
    if (username.trim()) {
      changeUsername(username);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        "WARNING: Are you sure you want to completely erase all data? This cannot be undone.",
      )
    ) {
      resetAllData();
      alert("All system data has been wiped.");
    }
  };

  return (
    <>
      <div
        className="welcome-banner"
        style={{
          marginBottom: "32px",
          animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <h1 className="greeting">System Settings</h1>
        <p className="status" style={{ fontSize: "15px" }}>
          Configure core OS variables, authenticate actions, and manage your
          profile.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "600px",
        }}
      >
        <Card delay={0.1}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                background: "rgba(0, 229, 255, 0.1)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3 style={{ fontSize: "16px", fontFamily: "Sora, sans-serif" }}>
              Profile Configuration
            </h3>
          </div>

          <form
            onSubmit={handleSave}
            style={{ display: "flex", gap: "12px", alignItems: "center" }}
          >
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                flex: 1,
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
            <Button type="submit">Save Changes</Button>
          </form>

          {showToast && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 16px",
                fontSize: "13px",
                color: "var(--green)",
                background: "rgba(52, 211, 153, 0.1)",
                border: "1px solid rgba(52, 211, 153, 0.2)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                animation: "fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Profile identity registered successfully.
            </div>
          )}
        </Card>

        <Card delay={0.2}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.05)",
                color: "var(--muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            <h3 style={{ fontSize: "16px", fontFamily: "Sora, sans-serif" }}>
              Authentication Operations
            </h3>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <Button
              onClick={logout}
              variant="ghost"
              style={{ border: "1px solid var(--border)" }}
            >
              Sign Out
            </Button>
          </div>
        </Card>

        <Card
          delay={0.3}
          style={{
            border: "1px solid rgba(244,63,94,0.3)",
            background: "rgba(6, 10, 19, 0.6)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                background: "rgba(244, 63, 94, 0.1)",
                color: "var(--rose)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3
              style={{
                fontSize: "16px",
                color: "var(--rose)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Danger Zone
            </h3>
          </div>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "13.5px",
              marginBottom: "20px",
              lineHeight: 1.5,
            }}
          >
            Wipe all local simulated data from the global state, resetting
            AstraOS entirely. User accounts remain active.{" "}
            <strong>This action is irreversible.</strong>
          </p>
          <Button onClick={handleReset} variant="danger">
            Factory Reset App Data
          </Button>
        </Card>
      </div>
    </>
  );
};

export default Settings;
