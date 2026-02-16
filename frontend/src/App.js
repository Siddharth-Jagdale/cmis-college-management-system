// ============================================================
// CMIS - App.js
// Main application component with routing setup
// ============================================================

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Students  from "./pages/Students";
import Courses   from "./pages/Courses";
import Marks     from "./pages/Marks";
import Fees      from "./pages/Fees";

// Layout wrapper for authenticated pages
import Navbar from "./components/Navbar";

/**
 * AppLayout wraps authenticated pages with the sidebar navigation.
 */
const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Navbar />
    <div className="main-content">{children}</div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes — require authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Students />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Courses />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/marks"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Marks />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fees"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Fees />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Default: redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404: redirect unknown routes to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
