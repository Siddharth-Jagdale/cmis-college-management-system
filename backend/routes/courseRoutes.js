// ============================================================
// CMIS - routes/courseRoutes.js
// All course-related routes (all protected)
// ============================================================

const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { protect } = require("../middleware/authMiddleware");

// Apply protect middleware to ALL routes in this file
router.use(protect);

// GET  /api/v1/courses       - Get all courses
// POST /api/v1/courses       - Add a new course
router.route("/").get(getAllCourses).post(addCourse);

// GET    /api/v1/courses/:id - Get course by ID
// PUT    /api/v1/courses/:id - Update course
// DELETE /api/v1/courses/:id - Delete course
router.route("/:id").get(getCourseById).put(updateCourse).delete(deleteCourse);

module.exports = router;
