// ============================================================
// CMIS - middleware/errorMiddleware.js
// Centralized error handling middleware
// ============================================================

/**
 * notFound middleware
 * Handles 404 errors for undefined routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * errorHandler middleware
 * Global error handler — returns user-readable JSON error messages.
 * Never exposes stack traces in production.
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 if status code wasn't set, or if it's still 200
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Log the error on the server side
  console.error(`[ERROR] ${err.message}`);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(". "),
    });
  }

  // Handle Mongoose duplicate key errors (e.g. unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `A record with this ${field} already exists.`,
    });
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format.",
    });
  }

  // Generic error response
  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected error occurred. Please try again.",
    // Only include stack trace in development
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
