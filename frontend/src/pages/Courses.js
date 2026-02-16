// ============================================================
// CMIS - pages/Courses.js
// Course management: view all, add, delete
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import { getAllCourses, addCourse, deleteCourse } from "../services/api";
import Loader from "../components/Loader";

const INITIAL_FORM = {
  courseName: "", courseCode: "", department: "", duration: "", description: "",
};

const Courses = () => {
  const [courses, setCourses]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [formData, setFormData]       = useState(INITIAL_FORM);
  const [formError, setFormError]     = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg]   = useState("");
  const [pageError, setPageError]     = useState("");

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setPageError("");
    try {
      const res = await getAllCourses();
      setCourses(res.data.data || []);
    } catch (err) {
      setPageError("Could not load courses. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleFormChange = (e) => {
    setFormError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setFormError("");

    const { courseName, courseCode, department, duration } = formData;
    if (!courseName.trim())  return setFormError("Course name is required.");
    if (!courseCode.trim())  return setFormError("Course code is required.");
    if (!department.trim())  return setFormError("Department is required.");
    if (!duration.trim())    return setFormError("Duration is required.");

    setFormLoading(true);
    try {
      await addCourse(formData);
      setShowModal(false);
      setFormData(INITIAL_FORM);
      setSuccessMsg("Course added successfully!");
      fetchCourses();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not add course.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete course "${name}"?`)) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      setSuccessMsg("Course deleted.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setPageError(err.response?.data?.message || "Could not delete course.");
    }
  };

  if (loading) return <Loader text="Loading courses..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">📚 Courses</h1>
          <p className="page-subtitle">{courses.length} course{courses.length !== 1 ? "s" : ""} offered</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setFormError(""); setFormData(INITIAL_FORM); }}>
          ➕ Add Course
        </button>
      </div>

      {pageError  && <div className="alert alert-error">⚠️ {pageError}</div>}
      {successMsg && <div className="alert alert-success">✅ {successMsg}</div>}

      {/* Course Cards Grid */}
      {courses.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <div className="empty-title">No courses yet</div>
            <div className="empty-desc">Click "Add Course" to create the first course.</div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "18px",
          }}
        >
          {courses.map((c) => (
            <div key={c._id} className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  padding: "20px",
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "16px" }}>{c.courseName}</div>
                    <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "2px" }}>
                      {c.department}
                    </div>
                  </div>
                  <span
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      padding: "3px 10px",
                      borderRadius: "100px",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {c.courseCode}
                  </span>
                </div>
              </div>
              <div style={{ padding: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#64748b" }}>
                    ⏱ Duration: <strong>{c.duration}</strong>
                  </span>
                </div>
                {c.description && (
                  <p style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "12px" }}>
                    {c.description}
                  </p>
                )}
                <button
                  className="btn btn-danger btn-sm"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => handleDelete(c._id, c.courseName)}
                >
                  Delete Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Also show as table */}
      {courses.length > 0 && (
        <div className="card" style={{ marginTop: "24px" }}>
          <div className="card-header">
            <span className="card-title">All Courses — Table View</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course Name</th>
                  <th>Code</th>
                  <th>Department</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c, i) => (
                  <tr key={c._id}>
                    <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                    <td className="td-name">{c.courseName}</td>
                    <td><span className="badge badge-purple">{c.courseCode}</span></td>
                    <td>{c.department}</td>
                    <td><span className="badge badge-green">{c.duration}</span></td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id, c.courseName)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">➕ Add New Course</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {formError && <div className="alert alert-error">⚠️ {formError}</div>}
              <form onSubmit={handleAddCourse} noValidate>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Course Name *</label>
                    <input
                      type="text" name="courseName" className="form-control"
                      placeholder="e.g. Bachelor of Technology"
                      value={formData.courseName} onChange={handleFormChange} required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Course Code *</label>
                    <input
                      type="text" name="courseCode" className="form-control"
                      placeholder="e.g. BTECH"
                      value={formData.courseCode} onChange={handleFormChange} required
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
                    <label className="form-label">Duration *</label>
                    <input
                      type="text" name="duration" className="form-control"
                      placeholder="e.g. 4 Years"
                      value={formData.duration} onChange={handleFormChange} required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description" className="form-control"
                    placeholder="Brief description of the course (optional)"
                    rows={3} value={formData.description} onChange={handleFormChange}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={formLoading}>
                    {formLoading ? "Adding..." : "Add Course"}
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

export default Courses;
