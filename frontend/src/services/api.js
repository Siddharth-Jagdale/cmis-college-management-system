// ============================================================
// CMIS - services/api.js
// Axios instance with request interceptor for JWT auth header
// ============================================================

import axios from "axios";

// Base URL for all API calls — configurable via env variable
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ──────────────────────────────────────
// Automatically attach JWT token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cmis_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ── Response Interceptor ─────────────────────────────────────
// Handle token expiry globally: redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect
      localStorage.removeItem("cmis_token");
      localStorage.removeItem("cmis_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth APIs ────────────────────────────────────────────────
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser    = (data) => api.post("/auth/login", data);
export const getMe        = ()     => api.get("/auth/me");

// ── Student APIs ─────────────────────────────────────────────
export const getAllStudents  = ()           => api.get("/students");
export const getStudentById  = (id)         => api.get(`/students/${id}`);
export const searchStudents  = (query)      => api.get(`/students/search?q=${query}`);
export const addStudent      = (data)       => api.post("/students", data);
export const updateStudent   = (id, data)   => api.put(`/students/${id}`, data);
export const deleteStudent   = (id)         => api.delete(`/students/${id}`);

// ── Course APIs ──────────────────────────────────────────────
export const getAllCourses = ()           => api.get("/courses");
export const getCourseById = (id)         => api.get(`/courses/${id}`);
export const addCourse     = (data)       => api.post("/courses", data);
export const updateCourse  = (id, data)   => api.put(`/courses/${id}`, data);
export const deleteCourse  = (id)         => api.delete(`/courses/${id}`);

// ── Marks APIs ───────────────────────────────────────────────
export const getAllMarks          = ()           => api.get("/marks");
export const getMarksByStudent    = (studentId)  => api.get(`/marks/student/${studentId}`);
export const addMarks             = (data)       => api.post("/marks", data);
export const updateMarks          = (id, data)   => api.put(`/marks/${id}`, data);
export const deleteMarks          = (id)         => api.delete(`/marks/${id}`);

// ── Fees APIs ────────────────────────────────────────────────
export const getAllFees       = ()           => api.get("/fees");
export const getFeesByStudent = (studentId)  => api.get(`/fees/${studentId}`);
export const createFeeRecord  = (data)       => api.post("/fees", data);
export const updateFees       = (studentId, data) => api.put(`/fees/${studentId}`, data);

export default api;
