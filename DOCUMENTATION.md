# CMIS — Project Documentation
## College Management Information System
### Final Year Internship Project | Hexaware Technologies

---

## 1. Introduction

The College Management Information System (CMIS) is a web-based application built to digitize and streamline the daily administrative operations of a college or university. Traditional paper-based systems are error-prone, time-consuming, and hard to scale. CMIS replaces these with a centralized, secure, and role-based digital platform.

The system is developed using the MERN stack — MongoDB, Express.js, React.js, and Node.js — which allows for a fully JavaScript-based development workflow from database to user interface.

---

## 2. Problem Statement

Educational institutions manage large volumes of student data daily — including admissions, course enrollments, academic performance, and fee transactions. Without a centralized system:

- Data is scattered across spreadsheets and physical files
- Searching for student records is slow and error-prone
- Fee tracking is inconsistent and lacks real-time visibility
- Academic performance (marks) is hard to consolidate
- No role-based access control exists

**CMIS solves this** by providing a unified, secure, and easy-to-use platform accessible from any web browser.

---

## 3. Objectives

- Provide a secure login system for authorized users (JWT + bcrypt)
- Maintain a centralized student registry with search capability
- Manage course offerings and student enrollments
- Record and retrieve student marks per subject
- Track fee payment status (paid vs. pending) per student
- Provide a real-time dashboard with summary statistics
- Ensure all sensitive routes are protected from unauthorized access

---

## 4. Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Backend JavaScript runtime |
| Express.js | 4.x | REST API web framework |
| MongoDB | 6.x | NoSQL document database |
| Mongoose | 7.x | MongoDB ORM for schema and validation |
| React.js | 18.x | Frontend UI library |
| React Router | 6.x | Client-side routing |
| Axios | 1.x | HTTP client for API calls |
| JWT (jsonwebtoken) | 9.x | Stateless authentication tokens |
| bcryptjs | 2.x | Password hashing |
| dotenv | 16.x | Environment variable configuration |
| cors | 2.x | Cross-Origin Resource Sharing middleware |

---

## 5. System Architecture

The system follows a 3-tier architecture:

```
[Browser / React Client]
        ↕  HTTP (JSON)
[Express.js REST API — Node.js]
  ├── JWT Auth Middleware
  ├── Student Controller
  ├── Course Controller
  ├── Marks Controller
  └── Fees Controller
        ↕  Mongoose ODM
[MongoDB Database]
```

- The **frontend** communicates with the backend exclusively through versioned REST APIs (`/api/v1/`).
- The **backend** validates every protected request using JWT middleware before processing it.
- The **database** stores all data as JSON documents in MongoDB collections.

---

## 6. Database Schema

### User
```
email     : String (required, unique)
password  : String (bcrypt hashed)
createdAt : Date (auto)
```

### Student
```
name           : String (required)
email          : String (required, unique)
department     : String (required)
course         : String (required)
phone          : String
enrollmentYear : Number
```

### Course
```
courseName  : String (required)
courseCode  : String (required, unique, uppercase)
department  : String (required)
duration    : String (required)
description : String
```

### Marks
```
studentId : ObjectId → Student (required)
subject   : String (required)
marks     : Number (0–100, required)
examType  : Enum [Internal, External, Practical, Assignment]
semester  : String
```

### Fees
```
studentId       : ObjectId → Student (required, unique)
feesPaid        : Number (default 0)
feesPending     : Number (default 0)
totalFees       : Number
lastPaymentDate : Date
```

---

## 7. Features

### 7.1 Authentication Module
- User registration with email and password
- Duplicate email detection with user-friendly message
- Password hashing using bcryptjs (10 salt rounds)
- JWT token generation on login with configurable expiry
- All non-auth endpoints protected by JWT middleware
- Token stored in browser localStorage; cleared on logout
- Axios interceptor automatically attaches token to every request
- Session restored on page refresh via localStorage

### 7.2 Student Module
- Add students with name, email, department, course, phone, enrollment year
- View all students in a paginated table
- Real-time search across name, email, department, and course fields
- Delete students with confirmation dialog
- Duplicate email validation on both client and server

### 7.3 Course Module
- Add courses with name, code, department, duration, and description
- Visual card view with gradient headers
- Tabular view for quick scanning
- Unique course code enforcement

### 7.4 Marks Module
- Add marks entries linked to a student and subject
- Exam type categorization (Internal / External / Practical / Assignment)
- Filter marks table by individual student
- Auto-calculated grade (A+ to F) based on marks value
- Marks validation (0–100)

### 7.5 Fees Module
- Create fee records for students (one record per student)
- View all fee records with paid/pending/total breakdown
- Update existing fee records
- Auto-computed total from paid + pending values
- Last payment date tracking
- Visual alerts for students without fee records

### 7.6 Dashboard
- Real-time summary cards: total students, courses, average marks, fees collected, fees pending
- Recent students table
- Recent courses panel
- Quick action buttons for common tasks

---

## 8. API Route Summary

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/v1/auth/register | Register new user |
| POST | /api/v1/auth/login | Login, receive JWT |
| GET | /api/v1/auth/me | Get current user |
| GET | /api/v1/students | Get all students |
| POST | /api/v1/students | Add student |
| GET | /api/v1/students/search?q= | Search students |
| GET | /api/v1/students/:id | Get student by ID |
| PUT | /api/v1/students/:id | Update student |
| DELETE | /api/v1/students/:id | Delete student |
| GET | /api/v1/courses | Get all courses |
| POST | /api/v1/courses | Add course |
| DELETE | /api/v1/courses/:id | Delete course |
| GET | /api/v1/marks | Get all marks |
| POST | /api/v1/marks | Add marks |
| GET | /api/v1/marks/student/:id | Marks by student |
| DELETE | /api/v1/marks/:id | Delete marks |
| GET | /api/v1/fees | All fee records |
| POST | /api/v1/fees | Create fee record |
| GET | /api/v1/fees/:studentId | Fees by student |
| PUT | /api/v1/fees/:studentId | Update fees |

---

## 9. Security Implementation

1. **Password Hashing** — Passwords are never stored in plain text. bcryptjs hashes with 10 salt rounds before MongoDB insertion.
2. **JWT Authentication** — Signed tokens with secret key and expiry. Token is verified on every protected request.
3. **Protected Routes (Backend)** — `authMiddleware.js` validates the token and attaches `req.user`. All non-auth routes use this middleware.
4. **Protected Routes (Frontend)** — `ProtectedRoute.js` redirects unauthenticated users to `/login` before rendering any page.
5. **Error Handling** — `errorMiddleware.js` catches all errors, returns user-readable messages, and hides stack traces in production.
6. **Input Validation** — Mongoose validators + controller-level checks prevent invalid or duplicate data.

---

## 10. Screenshots

*(Insert screenshots of the running application here)*

1. **Login Page** — Clean authentication form with CMIS branding
2. **Register Page** — Account creation with password confirmation
3. **Dashboard** — Summary stats, recent students, quick actions
4. **Students Page** — Full list with search functionality
5. **Add Student Modal** — Validated form with all fields
6. **Courses Page** — Card grid + table view
7. **Marks Page** — Filtered marks table with auto grades
8. **Fees Page** — Fee records with paid/pending status

---

## 11. Setup Instructions Summary

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Edit MONGO_URI and JWT_SECRET
npm run dev            # Starts on port 5000
```

### Frontend
```bash
cd frontend
npm install
npm start              # Opens on port 3000
```

---

## 12. Conclusion

The College Management Information System (CMIS) successfully demonstrates a production-quality, full-stack MERN application. The system covers all core requirements from the project specification:

- Secure user authentication with JWT and bcrypt
- Complete CRUD operations for students, courses, marks, and fees
- Responsive and clean React frontend with protected routing
- Well-structured REST API with versioning (/api/v1/)
- Centralized error handling and logging
- Ready for GitHub submission and local deployment

The project is entirely free to run — using MongoDB Atlas free tier or a local MongoDB instance — and follows industry-standard coding conventions suitable for internship-level evaluation.

---

*Developed by: [Your Name]*
*Internship Organization: Hexaware Technologies*
*Technology Stack: MongoDB · Express.js · React.js · Node.js (MERN)*
