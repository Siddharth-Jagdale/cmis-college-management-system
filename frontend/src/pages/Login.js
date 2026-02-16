// ============================================================
// CMIS - pages/Login.js
// User login page with form validation
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  // If already logged in, go to dashboard
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleChange = (e) => {
    setError(""); // clear error on change
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!formData.email.trim()) {
      return setError("Please enter your email address.");
    }
    if (!formData.password) {
      return setError("Please enter your password.");
    }

    setLoading(true);
    try {
      const response = await loginUser(formData);
      const { user, token } = response.data;

      // Store in context + localStorage
      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <span className="logo-icon">🏫</span>
          <h1>CMIS</h1>
          <p>College Management Information System</p>
        </div>

        <h2 className="auth-title">Sign in to your account</h2>

        {/* Error Alert */}
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "10px" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Register link */}
        <div className="auth-link">
          New User?{" "}
          <Link to="/register">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
