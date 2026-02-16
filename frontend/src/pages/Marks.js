// ============================================================
// CMIS - pages/Marks.js
// Marks management: view by student, add marks
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import { getAllStudents, getAllMarks, getMarksByStudent, addMarks, deleteMarks } from "../services/api";
import Loader from "../components/Loader";

const INITIAL_FORM = {
  studentId: "", subject: "", marks: "", examType: "External", semester: "",
};

const Marks = () => {
  const [students, setStudents]         = useState([]);
  const [marks, setMarks]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [showModal, setShowModal]       = useState(false);
  const [formData, setFormData]         = useState(INITIAL_FORM);
  const [formError, setFormError]       = useState("");
  const [formLoading, setFormLoading]   = useState(false);
  const [successMsg, setSuccessMsg]     = useState("");
  const [pageError, setPageError]       = useState("");

  // Fetch all data on mount
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsRes, marksRes] = await Promise.all([getAllStudents(), getAllMarks()]);
      setStudents(studentsRes.data.data || []);
      setMarks(marksRes.data.data || []);
    } catch (err) {
      setPageError("Could not load data. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInitialData(); }, [fetchInitialData]);

  // Filter marks by selected student
  const handleStudentFilter = async (studentId) => {
    setSelectedStudent(studentId);
    setPageError("");
    if (!studentId) {
      const res = await getAllMarks();
      setMarks(res.data.data || []);
      return;
    }
    try {
      const res = await getMarksByStudent(studentId);
      setMarks(res.data.data || []);
    } catch (err) {
      setPageError("Could not fetch marks for this student.");
    }
  };

  const handleFormChange = (e) => {
    setFormError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMarks = async (e) => {
    e.preventDefault();
    setFormError("");

    const { studentId, subject, marks: marksVal } = formData;
    if (!studentId)          return setFormError("Please select a student.");
    if (!subject.trim())     return setFormError("Subject is required.");
    if (marksVal === "")     return setFormError("Marks value is required.");
    if (Number(marksVal) < 0 || Number(marksVal) > 100)
      return setFormError("Marks must be between 0 and 100.");

    setFormLoading(true);
    try {
      await addMarks({ ...formData, marks: Number(formData.marks) });
      setShowModal(false);
      setFormData(INITIAL_FORM);
      setSuccessMsg("Marks added successfully!");

      // Refresh marks
      if (selectedStudent) {
        const res = await getMarksByStudent(selectedStudent);
        setMarks(res.data.data || []);
      } else {
        const res = await getAllMarks();
        setMarks(res.data.data || []);
      }
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not add marks.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this marks entry?")) return;
    try {
      await deleteMarks(id);
      setMarks((prev) => prev.filter((m) => m._id !== id));
      setSuccessMsg("Marks entry deleted.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setPageError("Could not delete marks entry.");
    }
  };

  // Grade helper
  const getGrade = (m) => {
    if (m >= 90) return { label: "A+", cls: "badge-green" };
    if (m >= 75) return { label: "A",  cls: "badge-green" };
    if (m >= 60) return { label: "B",  cls: "badge-blue" };
    if (m >= 50) return { label: "C",  cls: "badge-yellow" };
    if (m >= 35) return { label: "D",  cls: "badge-yellow" };
    return { label: "F",  cls: "badge-red" };
  };

  if (loading) return <Loader text="Loading marks data..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">📝 Marks</h1>
          <p className="page-subtitle">{marks.length} marks entr{marks.length !== 1 ? "ies" : "y"}</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setFormError(""); setFormData(INITIAL_FORM); }}>
          ➕ Add Marks
        </button>
      </div>

      {pageError  && <div className="alert alert-error">⚠️ {pageError}</div>}
      {successMsg && <div className="alert alert-success">✅ {successMsg}</div>}

      {/* Filter by Student */}
      <div className="card" style={{ marginBottom: "20px", padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "#475569" }}>
            Filter by Student:
          </label>
          <select
            className="form-control"
            style={{ maxWidth: "300px" }}
            value={selectedStudent}
            onChange={(e) => handleStudentFilter(e.target.value)}
          >
            <option value="">All Students</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} — {s.department}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Marks Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Marks Records</span>
        </div>
        <div className="table-wrap">
          {marks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <div className="empty-title">No marks found</div>
              <div className="empty-desc">
                {selectedStudent ? "No marks for this student yet." : 'Click "Add Marks" to get started.'}
              </div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Exam Type</th>
                  <th>Semester</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((m, i) => {
                  const grade = getGrade(m.marks);
                  return (
                    <tr key={m._id}>
                      <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                      <td className="td-name">
                        {m.studentId?.name || "N/A"}
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                          {m.studentId?.department}
                        </div>
                      </td>
                      <td>{m.subject}</td>
                      <td>
                        <strong style={{ fontSize: "15px" }}>{m.marks}</strong>
                        <span style={{ color: "#94a3b8", fontSize: "11px" }}>/100</span>
                      </td>
                      <td><span className={`badge ${grade.cls}`}>{grade.label}</span></td>
                      <td><span className="badge badge-gray">{m.examType}</span></td>
                      <td>{m.semester || "-"}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Marks Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">📝 Add Marks Entry</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {formError && <div className="alert alert-error">⚠️ {formError}</div>}
              <form onSubmit={handleAddMarks} noValidate>
                <div className="form-group">
                  <label className="form-label">Select Student *</label>
                  <select name="studentId" className="form-control" value={formData.studentId} onChange={handleFormChange} required>
                    <option value="">-- Choose a student --</option>
                    {students.map((s) => (
                      <option key={s._id} value={s._id}>{s.name} — {s.department}</option>
                    ))}
                  </select>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <input
                      type="text" name="subject" className="form-control"
                      placeholder="e.g. Mathematics"
                      value={formData.subject} onChange={handleFormChange} required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Marks (0–100) *</label>
                    <input
                      type="number" name="marks" className="form-control"
                      placeholder="e.g. 85"
                      min="0" max="100"
                      value={formData.marks} onChange={handleFormChange} required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Exam Type</label>
                    <select name="examType" className="form-control" value={formData.examType} onChange={handleFormChange}>
                      <option value="External">External</option>
                      <option value="Internal">Internal</option>
                      <option value="Practical">Practical</option>
                      <option value="Assignment">Assignment</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Semester</label>
                    <input
                      type="text" name="semester" className="form-control"
                      placeholder="e.g. Semester 3"
                      value={formData.semester} onChange={handleFormChange}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={formLoading}>
                    {formLoading ? "Adding..." : "Add Marks"}
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

export default Marks;
