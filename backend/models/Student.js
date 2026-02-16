// ============================================================
// CMIS - models/Student.js
// Mongoose schema for student records
// ============================================================

const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Student email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    enrollmentYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster search queries
studentSchema.index({ name: "text", email: "text", department: "text" });

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
