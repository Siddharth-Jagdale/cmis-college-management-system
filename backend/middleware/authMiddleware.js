// ============================================================
// CMIS - middleware/authMiddleware.js
// JWT authentication middleware - protects private routes
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * protect middleware
 * Verifies the JWT token from the Authorization header.
 * Attaches the authenticated user to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user (without password) to the request
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found. Please login again." });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error.message);

      // Handle specific JWT errors
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Your session has expired. Please login again." });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token. Please login again." });
      }

      return res.status(401).json({ message: "Not authorized. Please login." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided. Please login to access this resource." });
  }
};

module.exports = { protect };
