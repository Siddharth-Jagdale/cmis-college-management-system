// ============================================================
// CMIS - models/Marks.js
// Mongoose schema for student marks records
// ============================================================

const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student ID is required"],
    },
    subject: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    marks: {
      type: Number,
      required: [true, "Marks value is required"],
      min: [0, "Marks cannot be less than 0"],
      max: [100, "Marks cannot exceed 100"],
    },
    examType: {
      type: String,
      enum: ["Internal", "External", "Practical", "Assignment"],
      default: "External",
    },
    semester: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Marks = mongoose.model("Marks", marksSchema);
module.exports = Marks;
