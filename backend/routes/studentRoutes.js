// ============================================================
// CMIS - routes/studentRoutes.js
// All student-related routes (all protected)
// ============================================================

const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  searchStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");

// Apply protect middleware to ALL routes in this file
router.use(protect);

// GET  /api/v1/students/search?q=query  - Search students
router.get("/search", searchStudents);

// GET  /api/v1/students       - Get all students
// POST /api/v1/students       - Add new student
router.route("/").get(getAllStudents).post(addStudent);

// GET    /api/v1/students/:id - Get student by ID
// PUT    /api/v1/students/:id - Update student
// DELETE /api/v1/students/:id - Delete student
router.route("/:id").get(getStudentById).put(updateStudent).delete(deleteStudent);

module.exports = router;
