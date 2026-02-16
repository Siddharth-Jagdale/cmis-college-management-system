// ============================================================
// CMIS - routes/marksRoutes.js
// All marks-related routes (all protected)
// ============================================================

const express = require("express");
const router = express.Router();
const {
  getMarksByStudent,
  getAllMarks,
  addMarks,
  updateMarks,
  deleteMarks,
} = require("../controllers/marksController");
const { protect } = require("../middleware/authMiddleware");

// Apply protect middleware to ALL routes in this file
router.use(protect);

// GET  /api/v1/marks         - Get all marks records
// POST /api/v1/marks         - Add new marks entry
router.route("/").get(getAllMarks).post(addMarks);

// GET /api/v1/marks/student/:studentId - Get marks by student ID
router.get("/student/:studentId", getMarksByStudent);

// PUT    /api/v1/marks/:id - Update marks record
// DELETE /api/v1/marks/:id - Delete marks record
router.route("/:id").put(updateMarks).delete(deleteMarks);

module.exports = router;
