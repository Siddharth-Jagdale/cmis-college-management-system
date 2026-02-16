// ============================================================
// CMIS - controllers/courseController.js
// Handles all course operations
// ============================================================

const Course = require("../models/Course");

/**
 * @desc    Get all courses
 * @route   GET /api/v1/courses
 * @access  Private
 */
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    console.log(`[COURSE] Fetched ${courses.length} courses`);
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    console.error("[COURSE] Get all error:", error.message);
    res.status(500).json({ message: "Could not fetch courses. Please try again." });
  }
};

/**
 * @desc    Get a single course by ID
 * @route   GET /api/v1/courses/:id
 * @access  Private
 */
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.error("[COURSE] Get by ID error:", error.message);
    res.status(500).json({ message: "Could not fetch course details." });
  }
};

/**
 * @desc    Add a new course
 * @route   POST /api/v1/courses
 * @access  Private
 */
const addCourse = async (req, res) => {
  try {
    const { courseName, courseCode, department, duration, description } = req.body;

    if (!courseName || !courseCode || !department || !duration) {
      return res.status(400).json({
        message: "Please fill in all required fields: courseName, courseCode, department, duration.",
      });
    }

    // Check for duplicate course code
    const existing = await Course.findOne({ courseCode: courseCode.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: "A course with this course code already exists." });
    }

    const course = await Course.create({ courseName, courseCode, department, duration, description });
    console.log(`[COURSE] New course added: ${course.courseName} (${course.courseCode})`);

    res.status(201).json({ success: true, message: "Course added successfully.", data: course });
  } catch (error) {
    console.error("[COURSE] Add error:", error.message);
    res.status(500).json({ message: "Could not add course. Please try again." });
  }
};

/**
 * @desc    Update a course
 * @route   PUT /api/v1/courses/:id
 * @access  Private
 */
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }
    console.log(`[COURSE] Updated course: ${course.courseName}`);
    res.status(200).json({ success: true, message: "Course updated successfully.", data: course });
  } catch (error) {
    console.error("[COURSE] Update error:", error.message);
    res.status(500).json({ message: "Could not update course. Please try again." });
  }
};

/**
 * @desc    Delete a course
 * @route   DELETE /api/v1/courses/:id
 * @access  Private
 */
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }
    console.log(`[COURSE] Deleted course: ${course.courseName}`);
    res.status(200).json({ success: true, message: "Course deleted successfully." });
  } catch (error) {
    console.error("[COURSE] Delete error:", error.message);
    res.status(500).json({ message: "Could not delete course. Please try again." });
  }
};

module.exports = { getAllCourses, getCourseById, addCourse, updateCourse, deleteCourse };
