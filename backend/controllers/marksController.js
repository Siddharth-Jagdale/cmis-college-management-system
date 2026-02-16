// ============================================================
// CMIS - controllers/marksController.js
// Handles all marks operations
// ============================================================

const Marks = require("../models/Marks");
const Student = require("../models/Student");

/**
 * @desc    Get all marks for a specific student
 * @route   GET /api/v1/marks/:studentId
 * @access  Private
 */
const getMarksByStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const marks = await Marks.find({ studentId: req.params.studentId })
      .populate("studentId", "name email department course")
      .sort({ createdAt: -1 });

    console.log(`[MARKS] Fetched ${marks.length} marks for student ${student.name}`);
    res.status(200).json({ success: true, count: marks.length, data: marks, student });
  } catch (error) {
    console.error("[MARKS] Get by student error:", error.message);
    res.status(500).json({ message: "Could not fetch marks. Please try again." });
  }
};

/**
 * @desc    Get all marks (all students)
 * @route   GET /api/v1/marks
 * @access  Private
 */
const getAllMarks = async (req, res) => {
  try {
    const marks = await Marks.find()
      .populate("studentId", "name email department")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: marks.length, data: marks });
  } catch (error) {
    console.error("[MARKS] Get all error:", error.message);
    res.status(500).json({ message: "Could not fetch marks. Please try again." });
  }
};

/**
 * @desc    Add marks for a student
 * @route   POST /api/v1/marks
 * @access  Private
 */
const addMarks = async (req, res) => {
  try {
    const { studentId, subject, marks, examType, semester } = req.body;

    if (!studentId || !subject || marks === undefined) {
      return res.status(400).json({
        message: "Please provide studentId, subject, and marks.",
      });
    }

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const newMarks = await Marks.create({ studentId, subject, marks, examType, semester });
    console.log(`[MARKS] Added marks for student ${student.name}: ${subject} = ${marks}`);

    res.status(201).json({ success: true, message: "Marks added successfully.", data: newMarks });
  } catch (error) {
    console.error("[MARKS] Add error:", error.message);
    res.status(500).json({ message: "Could not add marks. Please try again." });
  }
};

/**
 * @desc    Update a marks record
 * @route   PUT /api/v1/marks/:id
 * @access  Private
 */
const updateMarks = async (req, res) => {
  try {
    const marksRecord = await Marks.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!marksRecord) {
      return res.status(404).json({ message: "Marks record not found." });
    }
    res.status(200).json({ success: true, message: "Marks updated successfully.", data: marksRecord });
  } catch (error) {
    console.error("[MARKS] Update error:", error.message);
    res.status(500).json({ message: "Could not update marks. Please try again." });
  }
};

/**
 * @desc    Delete a marks record
 * @route   DELETE /api/v1/marks/:id
 * @access  Private
 */
const deleteMarks = async (req, res) => {
  try {
    const marksRecord = await Marks.findByIdAndDelete(req.params.id);
    if (!marksRecord) {
      return res.status(404).json({ message: "Marks record not found." });
    }
    res.status(200).json({ success: true, message: "Marks deleted successfully." });
  } catch (error) {
    console.error("[MARKS] Delete error:", error.message);
    res.status(500).json({ message: "Could not delete marks. Please try again." });
  }
};

module.exports = { getMarksByStudent, getAllMarks, addMarks, updateMarks, deleteMarks };
