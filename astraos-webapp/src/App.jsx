import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Guards & Layouts
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy Loaded Pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Study = lazy(() => import("./pages/Study"));
const FocusTube = lazy(() => import("./pages/FocusTube"));
const Vault = lazy(() => import("./pages/Vault"));
const Health = lazy(() => import("./pages/Health"));
const Entertainment = lazy(() => import("./pages/Entertainment"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Custom Loading Fallback Component
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100%",
      flexDirection: "column",
      gap: "16px",
    }}
  >
    <div style={{ width: 40, height: 40, position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "3px solid rgba(0, 229, 255, 0.1)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "3px solid transparent",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin 1s cubic-bezier(0.16, 1, 0.3, 1) infinite",
        }}
      />
    </div>
    <div
      style={{
        fontSize: "13px",
        color: "var(--muted)",
        animation: "pulseOpacity 2s infinite",
      }}
    >
      Initializing module...
    </div>
    <style>{`
       @keyframes spin { to { transform: rotate(360deg); } }
       @keyframes pulseOpacity { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
     `}</style>
  </div>
);

const AppContent = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/study" element={<Study />} />
            <Route path="/focustube" element={<FocusTube />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/health" element={<Health />} />
            <Route path="/entertainment" element={<Entertainment />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;
