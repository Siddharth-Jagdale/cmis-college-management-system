// ============================================================
// CMIS - pages/Dashboard.js
// Main dashboard with summary stats
// ============================================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllStudents, getAllCourses, getAllMarks, getAllFees } from "../services/api";
import Loader from "../components/Loader";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch counts from all modules in parallel
        const [studentsRes, coursesRes, marksRes, feesRes] = await Promise.all([
          getAllStudents(),
          getAllCourses(),
          getAllMarks(),
          getAllFees(),
        ]);

        const students = studentsRes.data.data || [];
        const courses  = coursesRes.data.data  || [];
        const marks    = marksRes.data.data    || [];
        const fees     = feesRes.data.data     || [];

        // Compute totals
        const totalFeesPaid    = fees.reduce((sum, f) => sum + (f.feesPaid    || 0), 0);
        const totalFeesPending = fees.reduce((sum, f) => sum + (f.feesPending || 0), 0);

        // Compute average marks
        const avgMarks = marks.length
          ? (marks.reduce((sum, m) => sum + (m.marks || 0), 0) / marks.length).toFixed(1)
          : 0;

        setStats({
          totalStudents:    students.length,
          totalCourses:     courses.length,
          totalMarksEntries: marks.length,
          totalFeesPaid,
          totalFeesPending,
          avgMarks,
          recentStudents:   students.slice(0, 5),
          recentCourses:    courses.slice(0, 4),
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err.message);
        setError("Could not load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, <strong>{user?.email}</strong>
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {stats && (
        <>
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card" style={{ borderLeft: "4px solid #2563eb" }}>
              <div className="stat-icon" style={{ background: "#eff6ff" }}>🎓</div>
              <div>
                <div className="stat-value">{stats.totalStudents}</div>
                <div className="stat-label">Total Students</div>
              </div>
            </div>

            <div className="stat-card" style={{ borderLeft: "4px solid #7c3aed" }}>
              <div className="stat-icon" style={{ background: "#ede9fe" }}>📚</div>
              <div>
                <div className="stat-value">{stats.totalCourses}</div>
                <div className="stat-label">Courses Offered</div>
              </div>
            </div>

            <div className="stat-card" style={{ borderLeft: "4px solid #059669" }}>
              <div className="stat-icon" style={{ background: "#ecfdf5" }}>📝</div>
              <div>
                <div className="stat-value">{stats.avgMarks}</div>
                <div className="stat-label">Avg. Marks (of 100)</div>
              </div>
            </div>

            <div className="stat-card" style={{ borderLeft: "4px solid #d97706" }}>
              <div className="stat-icon" style={{ background: "#fffbeb" }}>💰</div>
              <div>
                <div className="stat-value">₹{stats.totalFeesPaid.toLocaleString()}</div>
                <div className="stat-label">Total Fees Collected</div>
              </div>
            </div>

            <div className="stat-card" style={{ borderLeft: "4px solid #dc2626" }}>
              <div className="stat-icon" style={{ background: "#fef2f2" }}>⚠️</div>
              <div>
                <div className="stat-value">₹{stats.totalFeesPending.toLocaleString()}</div>
                <div className="stat-label">Fees Pending</div>
              </div>
            </div>
          </div>

          {/* Two-column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            {/* Recent Students */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">🎓 Recent Students</span>
                <button className="btn btn-outline btn-sm" onClick={() => navigate("/students")}>
                  View All
                </button>
              </div>
              <div className="table-wrap">
                {stats.recentStudents.length === 0 ? (
                  <div className="empty-state" style={{ padding: "30px" }}>
                    <p className="empty-desc">No students added yet.</p>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Course</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentStudents.map((s) => (
                        <tr key={s._id}>
                          <td className="td-name">{s.name}</td>
                          <td>{s.department}</td>
                          <td>
                            <span className="badge badge-blue">{s.course}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Courses */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">📚 Active Courses</span>
                <button className="btn btn-outline btn-sm" onClick={() => navigate("/courses")}>
                  View All
                </button>
              </div>
              <div className="card-body" style={{ padding: "16px" }}>
                {stats.recentCourses.length === 0 ? (
                  <div className="empty-state" style={{ padding: "20px" }}>
                    <p className="empty-desc">No courses added yet.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {stats.recentCourses.map((c) => (
                      <div
                        key={c._id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 14px",
                          background: "#f8fafc",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "13.5px" }}>{c.courseName}</div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>{c.department}</div>
                        </div>
                        <span className="badge badge-purple">{c.courseCode}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">⚡ Quick Actions</span>
            </div>
            <div className="card-body" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={() => navigate("/students")}>
                ➕ Add Student
              </button>
              <button className="btn btn-outline" onClick={() => navigate("/courses")}>
                📚 Add Course
              </button>
              <button className="btn btn-outline" onClick={() => navigate("/marks")}>
                📝 Add Marks
              </button>
              <button className="btn btn-outline" onClick={() => navigate("/fees")}>
                💰 Manage Fees
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
