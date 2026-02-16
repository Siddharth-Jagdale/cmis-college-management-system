// ============================================================
// CMIS - routes/authRoutes.js
// Authentication routes: register, login, profile
// ============================================================

const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/v1/auth/register - Register a new user
router.post("/register", registerUser);

// POST /api/v1/auth/login - Login and receive JWT
router.post("/login", loginUser);

// GET /api/v1/auth/me - Get current user profile (protected)
router.get("/me", protect, getMe);

module.exports = router;
