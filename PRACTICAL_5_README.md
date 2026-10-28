# Practical 5: MongoDB Integration and Schema Design with Mongoose

- **Student Name:** Max Patel
- **Roll Number:** 24IT070
- **Course:** Advanced Web Development Frameworks (ITUE301)
- **Institution:** Charotar University of Science and Technology (CHARUSAT)
- **Repository URL:** [https://github.com/max7199/SEM5WDF](https://github.com/max7199/SEM5WDF)
- **Course Outcome:** CO1 (Database integration and schema modeling using Mongoose and MongoDB)
- **Program Outcomes:** PO3 (Design and development of solutions), PO5 (Modern tool usage)
- **Technology Stack:** Node.js, Express.js, MongoDB, Mongoose, Dotenv

---

## 1. Practical Aim & Objectives

The objective of Practical 5 is to transition the Task Management REST API from temporary in-memory data structures to a persistent, document-oriented database using **MongoDB** and **Mongoose ODM**.

### Key Objectives:
1. **Database Connection:** Connect Express securely to MongoDB using environment variables (`.env`) loaded via `dotenv`.
2. **Schema & Model Design:** Create a strictly validated Mongoose schema in `models/Task.js` with required constraints, defaults, enum restrictions, and a pre-save trimming hook.
3. **Database-Backed CRUD:** Replace in-memory array operations with asynchronous Mongoose operations (`Task.find()`, `Task.findById()`, `Task.create()`, `Task.findByIdAndUpdate()`, `Task.findByIdAndDelete()`).
4. **Structured Error Handling:** Transform raw Mongoose `ValidationError` and `CastError` exceptions into clean, client-friendly JSON error responses without leaking stack traces or credentials.
5. **Data Persistence Verification:** Verify that data persists across server restarts in the local MongoDB `taskmanager` database.

---

## 2. Project Directory Structure

```text
student-portfolio/
├── controllers/
│   └── taskController.js       # Real Mongoose CRUD operations
├── middleware/
│   ├── logger.js               # Global request logger (Method, URL, Timestamp)
│   ├── checkContentType.js     # Validates Content-Type: application/json (415)
│   ├── validateTaskId.js       # Validates 24-hex char MongoDB ObjectId (400)
│   └── errorHandler.js         # Safe error handler formatting Mongoose validation errors
├── models/
│   └── Task.js                 # Mongoose schema, validation rules, and pre-save hook
├── routes/
│   └── tasks.js                # Task routes (GET, POST, PUT, DELETE)
├── server.js                   # Database connection and Express app configuration
├── test-practical5.js          # Automated test runner testing all 12 database scenarios
├── .env                        # Local database URI & port (gitignored)
├── .env.example                # Template configuration file
├── package.json                # Dependencies (mongoose, dotenv, express)
├── PRACTICAL_5_README.md       # Practical 5 documentation & Viva Q&A
└── README.md                   # Full portfolio & practicals guide
```

---

## 3. MongoDB Configuration & Environment Variables

### `.env` File Setup
Database credentials and configuration are decoupled from the codebase using environment variables:

```env
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
PORT=5000
```

> **Security Note:** `.env` is listed in `.gitignore` to prevent database connection strings and credentials from ever being pushed to GitHub. A template file [`.env.example`](file:///d:/5THSEM%20WDF/PRATICAL/.env.example) is provided for collaboration.

### Connecting to MongoDB
In [server.js](file:///d:/5THSEM%20WDF/PRATICAL/server.js), Mongoose establishes the database connection before the server begins listening:

```javascript
const conn = await mongoose.connect(process.env.MONGO_URI);
console.log(`MongoDB Connected: ${conn.connection.host}`);
```

If the MongoDB daemon is not running, the application gracefully logs an error and exits (`process.exit(1)`) rather than running in an invalid state.

---

## 4. Mongoose Schema Definition (`models/Task.js`)

The `Task` model enforces validation rules and default values:

```javascript
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be either low, medium, or high'
    },
    default: 'medium'
  }
});

// Pre-save hook to trim whitespace from the title
taskSchema.pre('save', function (next) {
  if (typeof this.title === 'string') {
    this.title = this.title.trim();
  }
  if (typeof next === 'function') {
    next();
  }
});

export default mongoose.model('Task', taskSchema);
```

### Schema Features:
- `title`: Required non-empty string. Surrounding spaces are trimmed by both `trim: true` and the pre-save hook.
- `description`: Optional string, defaults to `""`.
- `completed`: Boolean, defaults to `false`.
- `createdAt`: Date, automatically set to `Date.now` when inserted.
- `priority`: Restricted strictly to `'low'`, `'medium'`, or `'high'` (default `'medium'`).

---

## 5. REST API Endpoint Specification

**Base URL:** `http://localhost:5000`

| Method | Endpoint | Description | Request Body | Success Status | Error Statuses |
|---|---|---|---|---|---|
| **GET** | `/tasks` | Retrieve all tasks from MongoDB | None | `200 OK` | `500` |
| **GET** | `/tasks/:id` | Retrieve one task by MongoDB ObjectId | None | `200 OK` | `400`, `404`, `500` |
| **POST** | `/tasks` | Create and save a new task document | `{ title, description?, completed?, priority? }` | `201 Created` | `400`, `415`, `500` |
| **PUT** | `/tasks/:id` | Update an existing task document | `{ title?, description?, completed?, priority? }` | `200 OK` | `400`, `404`, `415`, `500` |
| **DELETE** | `/tasks/:id` | Delete a task document by ID | None | `200 OK` | `400`, `404`, `500` |

---

## 6. Postman & cURL Testing Guide

### 1. GET `/tasks` — Retrieve All Tasks
- **URL:** `http://localhost:5000/tasks`
- **Method:** `GET`
- **Expected Status:** `200 OK`
- **Example Response:**
```json
[
  {
    "_id": "6ae1bd37a2b2440eea61a5ec",
    "title": "Complete Practical 5 Mongoose Integration",
    "description": "Connect Express to MongoDB and test CRUD",
    "completed": false,
    "priority": "medium",
    "createdAt": "2026-10-28T09:15:35.570Z",
    "__v": 0
  }
]
```

---

### 2. GET `/tasks/:id` — Retrieve Single Task by ID
- **URL:** `http://localhost:5000/tasks/6ae1bd37a2b2440eea61a5ec`
- **Method:** `GET`
- **Expected Status:** `200 OK`
- **Example Response:**
```json
{
  "_id": "6ae1bd37a2b2440eea61a5ec",
  "title": "Complete Practical 5 Mongoose Integration",
  "description": "Connect Express to MongoDB and test CRUD",
  "completed": false,
  "priority": "medium",
  "createdAt": "2026-10-28T09:15:35.570Z",
  "__v": 0
}
```

---

### 3. POST `/tasks` — Create a Valid Task
- **URL:** `http://localhost:5000/tasks`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "title": "Build Final Examination Review",
  "description": "Prepare slides for ITUE301 viva exam",
  "priority": "high"
}
```
- **Expected Status:** `201 Created`
- **Example Response:**
```json
{
  "_id": "6ae1be29e222e07778e395c5",
  "title": "Build Final Examination Review",
  "description": "Prepare slides for ITUE301 viva exam",
  "completed": false,
  "priority": "high",
  "createdAt": "2026-10-28T09:25:10.123Z",
  "__v": 0
}
```

---

### 4. PUT `/tasks/:id` — Update Task with Validation
- **URL:** `http://localhost:5000/tasks/6ae1be29e222e07778e395c5`
- **Method:** `PUT`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "completed": true,
  "priority": "low"
}
```
- **Expected Status:** `200 OK`
- **Example Response:**
```json
{
  "_id": "6ae1be29e222e07778e395c5",
  "title": "Build Final Examination Review",
  "description": "Prepare slides for ITUE301 viva exam",
  "completed": true,
  "priority": "low",
  "createdAt": "2026-10-28T09:25:10.123Z",
  "__v": 0
}
```

---

### 5. DELETE `/tasks/:id` — Delete Task
- **URL:** `http://localhost:5000/tasks/6ae1be29e222e07778e395c5`
- **Method:** `DELETE`
- **Expected Status:** `200 OK`
- **Example Response:**
```json
{
  "message": "Task deleted successfully",
  "id": "6ae1be29e222e07778e395c5"
}
```

---

### 6. Error Test Cases

#### A. Missing Required Title (`400 Bad Request`):
```http
POST http://localhost:5000/tasks
Content-Type: application/json

{
  "description": "Missing title test"
}
```
**Response:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Task title is required"
    }
  ]
}
```

#### B. Invalid Priority Enum (`400 Bad Request`):
```http
POST http://localhost:5000/tasks
Content-Type: application/json

{
  "title": "Invalid Priority Task",
  "priority": "urgent"
}
```
**Response:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "priority",
      "message": "Priority must be either low, medium, or high"
    }
  ]
}
```

#### C. Malformed MongoDB ID (`400 Bad Request`):
```http
GET http://localhost:5000/tasks/123-bad-id
```
**Response:**
```json
{
  "error": "Invalid task ID"
}
```

#### D. Non-Existent Task ID (`404 Not Found`):
```http
GET http://localhost:5000/tasks/507f1f77bcf86cd799439011
```
**Response:**
```json
{
  "error": "Task not found"
}
```

---

## 7. How to Verify Database Persistence

1. **Verify with MongoDB Compass:**
   - Open **MongoDB Compass**.
   - Connect to `mongodb://127.0.0.1:27017`.
   - Select the `taskmanager` database.
   - Click on the `tasks` collection to see documents, their assigned `_id` values, and timestamps.
2. **Verify Persistence Across Server Restart:**
   - Create a task using `POST /tasks`.
   - Terminate the Node.js process (`Ctrl + C`).
   - Start the server again (`npm run server`).
   - Query `GET /tasks`. The task persists because MongoDB stores documents on disk.

---

## 8. How to Run Locally

### Start Express Backend (Port 5000)
```powershell
# 1. Install dependencies
npm install

# 2. Start the MongoDB API server
npm run server
```

### Run Automated Test Suite (12/12 Tests)
In a separate terminal:
```powershell
npm run test:p5
```

### Start Frontend Portfolio (Port 5173)
```powershell
npm run dev
```

---

## 9. Viva Questions & Answers for Practical 5

### Q1: What is MongoDB and how does it differ from a Relational Database (SQL)?
**Answer:** MongoDB is a NoSQL, document-oriented database that stores data in flexible, JSON-like BSON (Binary JSON) documents. Unlike relational databases (such as MySQL or PostgreSQL) which use fixed tables with rows and columns, MongoDB uses collections of schemaless documents, allowing for flexible and dynamic schema designs.

### Q2: What is Mongoose and why do we use it with Node.js?
**Answer:** Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a schema-based solution to model application data, enforce type casting, perform validation, define business logic hooks (middleware), and construct database queries conveniently.

### Q3: What is the purpose of Mongoose Schema and Model?
**Answer:** 
- **Schema:** Defines the structure of documents, including field types, validation rules, default values, and lifecycle hooks.
- **Model:** A compiled constructor compiled from the schema that provides the direct interface to interact with the MongoDB database (e.g., `Task.find()`, `Task.create()`).

### Q4: Why is `runValidators: true` necessary in `findByIdAndUpdate()`?
**Answer:** By default, Mongoose only executes schema validation when documents are created (`save()` or `create()`), not during update operations. Specifying `{ runValidators: true }` ensures that update payloads are checked against the schema rules (e.g., enum restrictions and required fields).

### Q5: What is a Mongoose Pre-save Hook?
**Answer:** A pre-save hook is a middleware function that runs automatically before a document is saved to the database (`save()` or `create()`). In this practical, we used `taskSchema.pre('save', ...)` to trim extraneous leading and trailing whitespace from the `title` field.

### Q6: What is a MongoDB ObjectId?
**Answer:** An ObjectId is a special 12-byte (24-hexadecimal character) unique identifier generated by MongoDB for the `_id` primary key field of each document. It encodes a 4-byte timestamp, a 5-byte random value, and a 3-byte incrementing counter.

### Q7: What is a `CastError` in Mongoose?
**Answer:** A `CastError` occurs when an input value cannot be coerced into the schema's defined type (for example, providing a non-24-hex string like `"123-bad"` for an `ObjectId` field). Our error handler intercepts `CastError` and returns `400 Bad Request`.

### Q8: What does the `enum` validator do in Mongoose?
**Answer:** The `enum` validator restricts a string field's allowable values to a specific array of allowed choices. For example, `priority: { enum: ['low', 'medium', 'high'] }` rejects any other priority value with a `ValidationError`.

### Q9: Why should `.env` be added to `.gitignore`?
**Answer:** The `.env` file contains sensitive configuration details like database connection strings, passwords, and API keys. Keeping it out of version control prevents accidental exposure of credentials on public repositories like GitHub.

### Q10: What is the difference between `Task.findByIdAndUpdate` and `Task.updateOne`?
**Answer:** `Task.updateOne` updates matching documents but does not return the updated document. `Task.findByIdAndUpdate` finds the document by ID, updates it, and with `{ returnDocument: 'after' }` (or `{ new: true }`), returns the updated document directly.

---

## 10. Verification Summary

- **Automated Tests:** 12/12 passed (`test-practical5.js`).
- **Database Used:** Local MongoDB service at `mongodb://127.0.0.1:27017/taskmanager`.
- **React Frontend:** Intact and verified (`npm run build` succeeds).
- **Git Repository:** [https://github.com/max7199/SEM5WDF](https://github.com/max7199/SEM5WDF).
