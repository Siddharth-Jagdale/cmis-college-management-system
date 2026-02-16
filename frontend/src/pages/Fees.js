// ============================================================
// CMIS - pages/Fees.js
// Fee management: view all, create/update fee records
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import {
  getAllStudents,
  getAllFees,
  getFeesByStudent,
  createFeeRecord,
  updateFees,
} from "../services/api";
import Loader from "../components/Loader";

const Fees = () => {
  const [students, setStudents]             = useState([]);
  const [fees, setFees]                     = useState([]);
  const [loading, setLoading]               = useState(true);
  const [selectedStudent, setSelectedStudent] = useState("");

  // Modal state
  const [showModal, setShowModal]           = useState(false);
  const [modalMode, setModalMode]           = useState("create"); // "create" | "update"
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [formData, setFormData]             = useState({ feesPaid: "", feesPending: "", totalFees: "" });
  const [formError, setFormError]           = useState("");
  const [formLoading, setFormLoading]       = useState(false);

  const [successMsg, setSuccessMsg]         = useState("");
  const [pageError, setPageError]           = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setPageError("");
    try {
      const [studentsRes, feesRes] = await Promise.all([getAllStudents(), getAllFees()]);
      setStudents(studentsRes.data.data || []);
      setFees(feesRes.data.data || []);
    } catch (err) {
      setPageError("Could not load fee data. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Filter by student
  const handleStudentFilter = async (studentId) => {
    setSelectedStudent(studentId);
    setPageError("");
    if (!studentId) {
      const res = await getAllFees();
      setFees(res.data.data || []);
      return;
    }
    try {
      const res = await getFeesByStudent(studentId);
      setFees(res.data ? [res.data.data] : []);
    } catch (err) {
      if (err.response?.status === 404) {
        setFees([]);
      } else {
        setPageError("Could not load fees for this student.");
      }
    }
  };

  // Open modal for creating new fee record
  const openCreateModal = () => {
    setModalMode("create");
    setSelectedStudentId("");
    setFormData({ feesPaid: "", feesPending: "", totalFees: "" });
    setFormError("");
    setShowModal(true);
  };

  // Open modal for updating existing fee record
  const openUpdateModal = (fee) => {
    setModalMode("update");
    setSelectedStudentId(fee.studentId?._id || fee.studentId);
    setFormData({
      feesPaid:    fee.feesPaid,
      feesPending: fee.feesPending,
      totalFees:   fee.totalFees || fee.feesPaid + fee.feesPending,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    setFormError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const { feesPaid, feesPending } = formData;

    if (modalMode === "create" && !selectedStudentId)
      return setFormError("Please select a student.");
    if (feesPaid === "")    return setFormError("Fees paid amount is required.");
    if (feesPending === "") return setFormError("Fees pending amount is required.");
    if (Number(feesPaid) < 0 || Number(feesPending) < 0)
      return setFormError("Fee amounts cannot be negative.");

    const payload = {
      feesPaid:    Number(feesPaid),
      feesPending: Number(feesPending),
      totalFees:   Number(feesPaid) + Number(feesPending),
    };

    setFormLoading(true);
    try {
      if (modalMode === "create") {
        await createFeeRecord({ studentId: selectedStudentId, ...payload });
        setSuccessMsg("Fee record created successfully!");
      } else {
        await updateFees(selectedStudentId, payload);
        setSuccessMsg("Fee record updated successfully!");
      }
      setShowModal(false);
      fetchData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not save fee record.");
    } finally {
      setFormLoading(false);
    }
  };

  // Compute summary
  const totalPaid    = fees.reduce((sum, f) => sum + (f.feesPaid    || 0), 0);
  const totalPending = fees.reduce((sum, f) => sum + (f.feesPending || 0), 0);

  // Students who don't have a fee record yet
  const studentsWithFees = new Set(fees.map((f) => (f.studentId?._id || f.studentId)?.toString()));
  const studentsWithoutFees = students.filter((s) => !studentsWithFees.has(s._id.toString()));

  if (loading) return <Loader text="Loading fees data..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">💰 Fees</h1>
          <p className="page-subtitle">{fees.length} fee record{fees.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          ➕ Add Fee Record
        </button>
      </div>

      {pageError  && <div className="alert alert-error">⚠️ {pageError}</div>}
      {successMsg && <div className="alert alert-success">✅ {successMsg}</div>}

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: "20px" }}>
        <div className="stat-card" style={{ borderLeft: "4px solid #059669" }}>
          <div className="stat-icon" style={{ background: "#ecfdf5" }}>✅</div>
          <div>
            <div className="stat-value">₹{totalPaid.toLocaleString()}</div>
            <div className="stat-label">Total Fees Paid</div>
          </div>
        </div>
        <div className="stat-card" style={{ borderLeft: "4px solid #dc2626" }}>
          <div className="stat-icon" style={{ background: "#fef2f2" }}>⏳</div>
          <div>
            <div className="stat-value">₹{totalPending.toLocaleString()}</div>
            <div className="stat-label">Total Fees Pending</div>
          </div>
        </div>
        <div className="stat-card" style={{ borderLeft: "4px solid #2563eb" }}>
          <div className="stat-icon" style={{ background: "#eff6ff" }}>📋</div>
          <div>
            <div className="stat-value">{fees.length}</div>
            <div className="stat-label">Fee Records</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="card" style={{ marginBottom: "20px", padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "#475569" }}>
            Filter by Student:
          </label>
          <select
            className="form-control" style={{ maxWidth: "300px" }}
            value={selectedStudent} onChange={(e) => handleStudentFilter(e.target.value)}
          >
            <option value="">All Students</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>{s.name} — {s.department}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Fees Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Fee Records</span>
        </div>
        <div className="table-wrap">
          {fees.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💰</div>
              <div className="empty-title">No fee records found</div>
              <div className="empty-desc">
                {selectedStudent
                  ? "No fee record for this student yet."
                  : 'Click "Add Fee Record" to get started.'}
              </div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Department</th>
                  <th>Fees Paid</th>
                  <th>Fees Pending</th>
                  <th>Total Fees</th>
                  <th>Status</th>
                  <th>Last Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f, i) => {
                  const isPending = f.feesPending > 0;
                  return (
                    <tr key={f._id}>
                      <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                      <td className="td-name">
                        {f.studentId?.name || "N/A"}
                      </td>
                      <td>{f.studentId?.department || "-"}</td>
                      <td>
                        <span style={{ color: "#059669", fontWeight: 600 }}>
                          ₹{(f.feesPaid || 0).toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: f.feesPending > 0 ? "#dc2626" : "#059669", fontWeight: 600 }}>
                          ₹{(f.feesPending || 0).toLocaleString()}
                        </span>
                      </td>
                      <td>₹{(f.totalFees || f.feesPaid + f.feesPending).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${isPending ? "badge-red" : "badge-green"}`}>
                          {isPending ? "Pending" : "Paid"}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {f.lastPaymentDate
                          ? new Date(f.lastPaymentDate).toLocaleDateString("en-IN")
                          : "-"}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => openUpdateModal(f)}
                        >
                          Update
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

      {/* Students without fee records */}
      {!selectedStudent && studentsWithoutFees.length > 0 && (
        <div className="alert alert-info" style={{ marginTop: "16px" }}>
          ℹ️ {studentsWithoutFees.length} student{studentsWithoutFees.length > 1 ? "s" : ""} without fee records:{" "}
          {studentsWithoutFees.map((s) => s.name).join(", ")}
        </div>
      )}

      {/* Add / Update Fee Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">
                {modalMode === "create" ? "➕ Add Fee Record" : "✏️ Update Fee Record"}
              </span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {formError && <div className="alert alert-error">⚠️ {formError}</div>}
              <form onSubmit={handleSubmit} noValidate>
                {modalMode === "create" && (
                  <div className="form-group">
                    <label className="form-label">Select Student *</label>
                    <select
                      className="form-control"
                      value={selectedStudentId}
                      onChange={(e) => { setFormError(""); setSelectedStudentId(e.target.value); }}
                      required
                    >
                      <option value="">-- Choose a student --</option>
                      {studentsWithoutFees.map((s) => (
                        <option key={s._id} value={s._id}>{s.name} — {s.department}</option>
                      ))}
                    </select>
                    {studentsWithoutFees.length === 0 && (
                      <p style={{ fontSize: "12px", color: "#64748b", marginTop: "6px" }}>
                        All students already have fee records. Use "Update" instead.
                      </p>
                    )}
                  </div>
                )}

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Fees Paid (₹) *</label>
                    <input
                      type="number" name="feesPaid" className="form-control"
                      placeholder="e.g. 50000" min="0"
                      value={formData.feesPaid} onChange={handleFormChange} required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fees Pending (₹) *</label>
                    <input
                      type="number" name="feesPending" className="form-control"
                      placeholder="e.g. 25000" min="0"
                      value={formData.feesPending} onChange={handleFormChange} required
                    />
                  </div>
                </div>

                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                  <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Total (auto-computed)</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
                    ₹{((Number(formData.feesPaid) || 0) + (Number(formData.feesPending) || 0)).toLocaleString()}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={formLoading}>
                    {formLoading ? "Saving..." : modalMode === "create" ? "Create Record" : "Update Record"}
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

export default Fees;
