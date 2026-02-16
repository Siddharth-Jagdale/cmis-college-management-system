# 🏫 CMIS — College Management Information System

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-61dafb?style=flat-square)](https://www.mongodb.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-68c43c?style=flat-square)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

> A full-stack College Management Information System built with the MERN stack (MongoDB, Express.js, React.js, Node.js) as a final year internship project.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Setup Instructions](#-setup-instructions)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## ✨ Features

| Module | Features |
|---|---|
| 🔐 **Authentication** | Register, Login, JWT tokens, bcrypt password hashing, protected routes |
| 🎓 **Students** | Add, view all, search (by name/email/dept), delete |
| 📚 **Courses** | Add, view all (card + table view), delete |
| 📝 **Marks** | Add marks per student, filter by student, auto grade (A+ to F), delete |
| 💰 **Fees** | View all fees, create/update fee records, paid/pending tracking |
| 📊 **Dashboard** | Live stats — total students, courses, avg marks, fee summary |

---

## 🛠 Tech Stack

### Backend
- **Node.js** — Runtime environment
- **Express.js** — Web framework
- **MongoDB** — Database (Atlas free tier or local)
- **Mongoose** — ODM for MongoDB
- **JWT (jsonwebtoken)** — Authentication tokens
- **bcryptjs** — Password hashing
- **dotenv** — Environment variable management
- **cors** — Cross-Origin Resource Sharing

### Frontend
- **React.js 18** — UI framework
- **React Router DOM v6** — Client-side routing
- **Axios** — HTTP client with request interceptors
- **Context API** — Global auth state management
- **Custom CSS** — No paid UI libraries

---

## 📁 Project Structure

```
cmis/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, GetMe
│   │   ├── studentController.js  # Student CRUD
│   │   ├── courseController.js   # Course CRUD
│   │   ├── marksController.js    # Marks CRUD
│   │   └── feesController.js     # Fees CRUD
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── errorMiddleware.js    # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Course.js
│   │   ├── Marks.js
│   │   └── Fees.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── marksRoutes.js
│   │   └── feesRoutes.js
│   ├── utils/
│   │   └── generateToken.js      # JWT helper
│   ├── server.js                 # Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Navbar.js         # Sidebar navigation
        │   ├── ProtectedRoute.js # Auth guard
        │   └── Loader.js         # Spinner
        ├── context/
        │   └── AuthContext.js    # Global auth state
        ├── pages/
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Dashboard.js
        │   ├── Students.js
        │   ├── Courses.js
        │   ├── Marks.js
        │   └── Fees.js
        ├── services/
        │   └── api.js            # Axios instance + API calls
        ├── App.js                # Router setup
        ├── index.js
        ├── index.css
        └── package.json
```

---

## 📦 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v16 or higher
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (local) **OR** a free [MongoDB Atlas](https://cloud.mongodb.com/) account

---

## 🚀 Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/cmis.git
cd cmis
```

### Step 2: Setup the Backend

```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create the environment file:
```bash
cp .env.example .env
```

Edit `.env` and fill in your values:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cmis_db
# OR use MongoDB Atlas:
# MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/cmis_db
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

✅ Backend will start on **http://localhost:5000**

---

### Step 3: Setup the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

✅ Frontend will open on **http://localhost:3000**

---

### Step 4: Use the Application

1. Open **http://localhost:3000** in your browser
2. Click **"Create Account"** to register a new user
3. Login with your credentials
4. Start adding students, courses, marks, and fee records!

---

## 📡 API Documentation

All routes are prefixed with `/api/v1/`

### Auth Routes
| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login & get JWT | No |
| GET | `/auth/me` | Get current user | Yes |

### Student Routes
| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/students` | Get all students | Yes |
| POST | `/students` | Add new student | Yes |
| GET | `/students/search?q=...` | Search students | Yes |
| GET | `/students/:id` | Get student by ID | Yes |
| PUT | `/students/:id` | Update student | Yes |
| DELETE | `/students/:id` | Delete student | Yes |

### Course Routes
| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/courses` | Get all courses | Yes |
| POST | `/courses` | Add new course | Yes |
| GET | `/courses/:id` | Get course by ID | Yes |
| PUT | `/courses/:id` | Update course | Yes |
| DELETE | `/courses/:id` | Delete course | Yes |

### Marks Routes
| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/marks` | Get all marks | Yes |
| POST | `/marks` | Add marks entry | Yes |
| GET | `/marks/student/:studentId` | Get marks by student | Yes |
| PUT | `/marks/:id` | Update marks | Yes |
| DELETE | `/marks/:id` | Delete marks | Yes |

### Fees Routes
| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/fees` | Get all fees | Yes |
| POST | `/fees` | Create fee record | Yes |
| GET | `/fees/:studentId` | Get fees by student | Yes |
| PUT | `/fees/:studentId` | Update fees | Yes |

> **Auth Header:** `Authorization: Bearer <your_jwt_token>`

---

## 🔒 Security

- Passwords hashed with **bcrypt** (salt rounds: 10)
- JWT tokens with configurable expiry (default: 7 days)
- All private routes protected via middleware
- User-readable error messages (no stack traces in production)
- Duplicate email detection on register

---

## 🧪 Testing the API

You can test the APIs using [Postman](https://www.postman.com/) or any REST client.

**Example: Login**
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@cmis.com",
  "password": "password123"
}
```

---

## 📸 Screenshots

> *(Add screenshots of your running application here for evaluation)*

- Login Page
- Registration Page
- Dashboard
- Students Page
- Courses Page
- Marks Page
- Fees Page

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed by - **Siddharth Jagdale**

Built with the **MERN Stack**: MongoDB · Express.js · React.js · Node.js
