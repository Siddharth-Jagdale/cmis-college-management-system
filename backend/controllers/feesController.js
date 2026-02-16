// ============================================================
// CMIS - controllers/feesController.js
// Handles all fee record operations
// ============================================================

const Fees = require("../models/Fees");
const Student = require("../models/Student");

/**
 * @desc    Get all fee records
 * @route   GET /api/v1/fees
 * @access  Private
 */
const getAllFees = async (req, res) => {
  try {
    const fees = await Fees.find()
      .populate("studentId", "name email department course")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: fees.length, data: fees });
  } catch (error) {
    console.error("[FEES] Get all error:", error.message);
    res.status(500).json({ message: "Could not fetch fee records. Please try again." });
  }
};

/**
 * @desc    Get fee record for a specific student
 * @route   GET /api/v1/fees/:studentId
 * @access  Private
 */
const getFeesByStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const fees = await Fees.findOne({ studentId: req.params.studentId }).populate(
      "studentId",
      "name email department course"
    );

    if (!fees) {
      return res.status(404).json({ message: "No fee record found for this student." });
    }

    console.log(`[FEES] Fetched fee record for student ${student.name}`);
    res.status(200).json({ success: true, data: fees });
  } catch (error) {
    console.error("[FEES] Get by student error:", error.message);
    res.status(500).json({ message: "Could not fetch fee details. Please try again." });
  }
};

/**
 * @desc    Create fee record for a student
 * @route   POST /api/v1/fees
 * @access  Private
 */
const createFeeRecord = async (req, res) => {
  try {
    const { studentId, feesPaid, feesPending, totalFees } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Check if fee record already exists
    const existing = await Fees.findOne({ studentId });
    if (existing) {
      return res.status(400).json({ message: "Fee record already exists for this student. Use update instead." });
    }

    const fees = await Fees.create({ studentId, feesPaid: feesPaid || 0, feesPending: feesPending || 0, totalFees: totalFees || 0 });
    console.log(`[FEES] Fee record created for student ${student.name}`);

    res.status(201).json({ success: true, message: "Fee record created successfully.", data: fees });
  } catch (error) {
    console.error("[FEES] Create error:", error.message);
    res.status(500).json({ message: "Could not create fee record. Please try again." });
  }
};

/**
 * @desc    Update fee record for a student
 * @route   PUT /api/v1/fees/:studentId
 * @access  Private
 */
const updateFees = async (req, res) => {
  try {
    const { feesPaid, feesPending, totalFees } = req.body;

    // Verify student exists
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const updateData = {};
    if (feesPaid   !== undefined) updateData.feesPaid   = feesPaid;
    if (feesPending !== undefined) updateData.feesPending = feesPending;
    if (totalFees  !== undefined) updateData.totalFees  = totalFees;
    updateData.lastPaymentDate = new Date();

    const fees = await Fees.findOneAndUpdate(
      { studentId: req.params.studentId },
      updateData,
      { new: true, runValidators: true, upsert: true }
    ).populate("studentId", "name email department course");

    console.log(`[FEES] Updated fee record for student ${student.name}`);
    res.status(200).json({ success: true, message: "Fee record updated successfully.", data: fees });
  } catch (error) {
    console.error("[FEES] Update error:", error.message);
    res.status(500).json({ message: "Could not update fee record. Please try again." });
  }
};

module.exports = { getAllFees, getFeesByStudent, createFeeRecord, updateFees };
