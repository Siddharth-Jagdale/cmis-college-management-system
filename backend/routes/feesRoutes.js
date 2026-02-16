// ============================================================
// CMIS - routes/feesRoutes.js
// All fees-related routes (all protected)
// ============================================================

const express = require("express");
const router = express.Router();
const {
  getAllFees,
  getFeesByStudent,
  createFeeRecord,
  updateFees,
} = require("../controllers/feesController");
const { protect } = require("../middleware/authMiddleware");

// Apply protect middleware to ALL routes in this file
router.use(protect);

// GET  /api/v1/fees       - Get all fee records
// POST /api/v1/fees       - Create a new fee record
router.route("/").get(getAllFees).post(createFeeRecord);

// GET /api/v1/fees/:studentId - Get fees for a specific student
// PUT /api/v1/fees/:studentId - Update fees for a specific student
router.route("/:studentId").get(getFeesByStudent).put(updateFees);

module.exports = router;
