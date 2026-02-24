import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const auth = useAuth();

  if (!auth) {
    return (
      <div style={{ padding: "24px", color: "#fff" }}>
        Loading authentication...
      </div>
    );
  }

  const { user } = auth;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
