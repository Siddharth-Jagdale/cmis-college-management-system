// ============================================================
// CMIS - pages/Students.js
// Full student management: list, search, add, delete
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import {
  getAllStudents,
  searchStudents,
  addStudent,
  deleteStudent,
} from "../services/api";
import Loader from "../components/Loader";

const INITIAL_FORM = {
  name: "", email: "", department: "", course: "", phone: "", enrollmentYear: new Date().getFullYear(),
};

const Students = () => {
  const [students, setStudents]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [searchQuery, setSearchQuery]   = useState("");
  const [searching, setSearching]       = useState(false);
  const [showModal, setShowModal]       = useState(false);
  const [formData, setFormData]         = useState(INITIAL_FORM);
  const [formError, setFormError]       = useState("");
  const [formLoading, setFormLoading]   = useState(false);
  const [successMsg, setSuccessMsg]     = useState("");
  const [pageError, setPageError]       = useState("");

  // Fetch all students on mount
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setPageError("");
    try {
      const res = await getAllStudents();
      setStudents(res.data.data || []);
    } catch (err) {
      setPageError("Could not load students. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchStudents();
      return;
    }
    setSearching(true);
    try {
      const res = await searchStudents(searchQuery.trim());
      setStudents(res.data.data || []);
    } catch (err) {
      setPageError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  // Reset search
  const handleClearSearch = () => {
    setSearchQuery("");
    fetchStudents();
  };

  // Form change
  const handleFormChange = (e) => {
    setFormError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add student submit
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setFormError("");

    const { name, email, department, course } = formData;
    if (!name.trim())       return setFormError("Student name is required.");
    if (!email.trim())      return setFormError("Student email is required.");
    if (!department.trim()) return setFormError("Department is required.");
    if (!course.trim())     return setFormError("Course is required.");

    setFormLoading(true);
    try {
      await addStudent(formData);
      setShowModal(false);
      setFormData(INITIAL_FORM);
      setSuccessMsg("Student added successfully!");
      fetchStudents();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not add student. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete student
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete student "${name}"?`)) return;
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s._id !== id));
      setSuccessMsg("Student deleted successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not delete student.");
    }
  };

  if (loading) return <Loader text="Loading students..." />;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">🎓 Students</h1>
          <p className="page-subtitle">{students.length} student{students.length !== 1 ? "s" : ""} total</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setFormError(""); setFormData(INITIAL_FORM); }}>
          ➕ Add Student
        </button>
      </div>

      {/* Alerts */}
      {pageError  && <div className="alert alert-error">⚠️ {pageError}</div>}
      {successMsg && <div className="alert alert-success">✅ {successMsg}</div>}

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: "20px", padding: "16px 20px" }}>
        <form onSubmit={handleSearch} className="search-bar">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email, department, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={searching}>
            {searching ? "Searching..." : "Search"}
          </button>
          {searchQuery && (
            <button type="button" className="btn btn-outline btn-sm" onClick={handleClearSearch}>
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Student Records</span>
        </div>
        <div className="table-wrap">
          {students.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎓</div>
              <div className="empty-title">No students found</div>
              <div className="empty-desc">
                {searchQuery ? "Try a different search term." : 'Click "Add Student" to get started.'}
              </div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s._id}>
                    <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                    <td className="td-name">{s.name}</td>
                    <td>{s.email}</td>
                    <td>
                      <span className="badge badge-blue">{s.department}</span>
                    </td>
                    <td>{s.course}</td>
                    <td>{s.enrollmentYear || "-"}</td>
                    <td>
                      <div className="td-actions">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(s._id, s.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">➕ Add New Student</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {formError && <div className="alert alert-error">⚠️ {formError}</div>}
              <form onSubmit={handleAddStudent} noValidate>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text" name="name" className="form-control"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name} onChange={handleFormChange} required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email" name="email" className="form-control"
                      placeholder="student@college.edu"
                      value={formData.email} onChange={handleFormChange} required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <input
                      type="text" name="department" className="form-control"
                      placeholder="e.g. Computer Science"
                      value={formData.department} onChange={handleFormChange} required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Course *</label>
                    <input
                      type="text" name="course" className="form-control"
                      placeholder="e.g. B.Tech"
                      value={formData.course} onChange={handleFormChange} required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="text" name="phone" className="form-control"
                      placeholder="e.g. 9876543210"
                      value={formData.phone} onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Enrollment Year</label>
                    <input
                      type="number" name="enrollmentYear" className="form-control"
                      placeholder="e.g. 2024" min="2000" max="2099"
                      value={formData.enrollmentYear} onChange={handleFormChange}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={formLoading}>
                    {formLoading ? "Adding..." : "Add Student"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
