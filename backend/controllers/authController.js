// ============================================================
// CMIS - controllers/authController.js
// Handles user registration and login
// ============================================================

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        message: "User is already registered. Please login to the application.",
      });
    }

    // Create new user (password is hashed via pre-save hook in User model)
    const user = await User.create({ email, password });

    console.log(`[AUTH] New user registered: ${user.email}`);

    res.status(201).json({
      success: true,
      message: "Registration successful! You can now login.",
      user: {
        _id: user._id,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("[AUTH] Register error:", error.message);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

/**
 * @desc    Authenticate user & return JWT token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare entered password with hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    console.log(`[AUTH] User logged in: ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        _id: user._id,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("[AUTH] Login error:", error.message);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};

/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        email: req.user.email,
      },
    });
  } catch (error) {
    console.error("[AUTH] Get profile error:", error.message);
    res.status(500).json({ message: "Could not fetch user profile." });
  }
};

module.exports = { registerUser, loginUser, getMe };
