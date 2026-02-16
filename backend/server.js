// ============================================================
// CMIS - server.js
// Main entry point for the Express application
// ============================================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ──────────────────────────────────────────────
// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: false }));

// Enable CORS for frontend (localhost:3000)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// ── Routes ──────────────────────────────────────────────────
app.use("/api/v1/auth",     require("./routes/authRoutes"));
app.use("/api/v1/students", require("./routes/studentRoutes"));
app.use("/api/v1/courses",  require("./routes/courseRoutes"));
app.use("/api/v1/marks",    require("./routes/marksRoutes"));
app.use("/api/v1/fees",     require("./routes/feesRoutes"));

// ── Health Check Route ───────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "CMIS API is running",
    version: "v1",
    status: "OK",
  });
});

// ── Error Handling Middleware ────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅  CMIS server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
