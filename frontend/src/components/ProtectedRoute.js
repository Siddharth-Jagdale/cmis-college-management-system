// ============================================================
// CMIS - components/ProtectedRoute.js
// Redirects unauthenticated users to /login
// ============================================================

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

/**
 * Wraps a page component and only renders it if the user is authenticated.
 * Shows a loading screen while auth state is being restored from localStorage.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Still checking localStorage
  if (loading) {
    return <Loader fullScreen />;
  }

  // Not authenticated — redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
