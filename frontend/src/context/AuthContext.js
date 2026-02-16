// ============================================================
// CMIS - context/AuthContext.js
// Global authentication state using React Context API
// ============================================================

import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext(null);

/**
 * AuthProvider wraps the entire app and provides auth state
 * to all child components via useAuth() hook.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true); // true while checking localStorage

  // On mount: restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("cmis_token");
    const storedUser  = localStorage.getItem("cmis_user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        // Corrupted data — clear it
        localStorage.removeItem("cmis_token");
        localStorage.removeItem("cmis_user");
      }
    }
    setLoading(false);
  }, []);

  /**
   * Call this after a successful login/register API response.
   * Stores token and user in state AND localStorage.
   */
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("cmis_token", jwtToken);
    localStorage.setItem("cmis_user", JSON.stringify(userData));
  };

  /**
   * Log out the current user.
   * Clears state and localStorage.
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("cmis_token");
    localStorage.removeItem("cmis_user");
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to consume auth context.
 * Usage: const { user, login, logout, isAuthenticated } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return context;
};

export default AuthContext;
