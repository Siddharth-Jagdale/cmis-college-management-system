// ============================================================
// CMIS - controllers/studentController.js
// Handles all student CRUD operations
// ============================================================

const Student = require("../models/Student");

/**
 * @desc    Get all students
 * @route   GET /api/v1/students
 * @access  Private
 */
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    console.log(`[STUDENT] Fetched ${students.length} students`);
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    console.error("[STUDENT] Get all error:", error.message);
    res.status(500).json({ message: "Could not fetch students. Please try again." });
  }
};

/**
 * @desc    Get a single student by ID
 * @route   GET /api/v1/students/:id
 * @access  Private
 */
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    console.error("[STUDENT] Get by ID error:", error.message);
    res.status(500).json({ message: "Could not fetch student details." });
  }
};

/**
 * @desc    Search students by name, email, or department
 * @route   GET /api/v1/students/search?q=query
 * @access  Private
 */
const searchStudents = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Please provide a search query." });
    }

    // Case-insensitive search across name, email, department, course
    const students = await Student.find({
      $or: [
        { name:       { $regex: query, $options: "i" } },
        { email:      { $regex: query, $options: "i" } },
        { department: { $regex: query, $options: "i" } },
        { course:     { $regex: query, $options: "i" } },
      ],
    });

    console.log(`[STUDENT] Search "${query}" returned ${students.length} results`);
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    console.error("[STUDENT] Search error:", error.message);
    res.status(500).json({ message: "Search failed. Please try again." });
  }
};

/**
 * @desc    Add a new student
 * @route   POST /api/v1/students
 * @access  Private
 */
const addStudent = async (req, res) => {
  try {
    const { name, email, department, course, phone, enrollmentYear } = req.body;

    if (!name || !email || !department || !course) {
      return res.status(400).json({ message: "Please fill in all required fields: name, email, department, course." });
    }

    // Check for duplicate email
    const existing = await Student.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "A student with this email already exists." });
    }

    const student = await Student.create({ name, email, department, course, phone, enrollmentYear });
    console.log(`[STUDENT] New student added: ${student.name} (${student.email})`);

    res.status(201).json({ success: true, message: "Student added successfully.", data: student });
  } catch (error) {
    console.error("[STUDENT] Add error:", error.message);
    res.status(500).json({ message: "Could not add student. Please try again." });
  }
};

/**
 * @desc    Update a student record
 * @route   PUT /api/v1/students/:id
 * @access  Private
 */
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    console.log(`[STUDENT] Updated student: ${student.name}`);
    res.status(200).json({ success: true, message: "Student updated successfully.", data: student });
  } catch (error) {
    console.error("[STUDENT] Update error:", error.message);
    res.status(500).json({ message: "Could not update student. Please try again." });
  }
};

/**
 * @desc    Delete a student
 * @route   DELETE /api/v1/students/:id
 * @access  Private
 */
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    console.log(`[STUDENT] Deleted student: ${student.name}`);
    res.status(200).json({ success: true, message: "Student deleted successfully." });
  } catch (error) {
    console.error("[STUDENT] Delete error:", error.message);
    res.status(500).json({ message: "Could not delete student. Please try again." });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  searchStudents,
  addStudent,
  updateStudent,
  deleteStudent,
};
