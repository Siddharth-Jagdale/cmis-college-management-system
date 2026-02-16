// ============================================================
// CMIS - components/Navbar.js
// Sidebar navigation with active link highlighting
// ============================================================

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard",  icon: "📊" },
  { path: "/students",  label: "Students",   icon: "🎓" },
  { path: "/courses",   label: "Courses",    icon: "📚" },
  { path: "/marks",     label: "Marks",      icon: "📝" },
  { path: "/fees",      label: "Fees",       icon: "💰" },
];

const Navbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-title">🏫 CMIS</div>
        <div className="logo-sub">College Management System</div>
      </div>

      {/* Navigation Links */}
      <div className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>

        {NAV_ITEMS.map(({ path, label, icon }) => (
          <button
            key={path}
            className={`sidebar-link ${location.pathname === path ? "active" : ""}`}
            onClick={() => navigate(path)}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div
          style={{
            padding: "10px 12px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            marginBottom: "8px",
          }}
        >
          <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "2px" }}>
            Logged in as
          </div>
          <div
            style={{
              fontSize: "12.5px",
              color: "#94a3b8",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.email}
          </div>
        </div>

        <button className="sidebar-link" onClick={handleLogout} style={{ color: "#f87171" }}>
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
