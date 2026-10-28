# Practical 4: Building a RESTful API with Node.js and Express

- **Student Name:** Max Patel
- **Roll Number:** 24IT070
- **Repository URL:** [https://github.com/max7199/task5-todoapp-maxpatel.git](https://github.com/max7199/task5-todoapp-maxpatel.git)
- **Course Outcome:** CO1 (Understand and apply server-side JavaScript development using Node.js and Express)
- **Program Outcomes:** PO3 (Design/development of solutions), PO5 (Modern tool usage)
- **Technology Stack:** Node.js, Express.js (ES Modules), In-Memory JavaScript Array

---

## 1. Practical Aim & Objectives

The goal of Practical 4 is to design and implement a production-structured, modular RESTful API for Task Management using **Node.js** and **Express.js**.

### Key Objectives:
1. **Architect a Modular Project Structure:** Separate concerns across `server.js`, `routes/`, `controllers/`, and `middleware/` folders instead of writing monolithic code.
2. **In-Memory Data Persistence:** Store tasks in an in-memory array (`tasks = [...]`) with auto-incrementing IDs without requiring an external database.
3. **Implement Full CRUD Endpoints:**
   - `GET /tasks`: Retrieve all tasks (Status `200 OK`).
   - `POST /tasks`: Create a new task (Status `201 Created`).
   - `PUT /tasks/:id`: Update an existing task (Status `200 OK`).
   - `DELETE /tasks/:id`: Delete an existing task (Status `200 OK`).
4. **Build a Complete Middleware Pipeline:**
   - Global Request Logger (`middleware/logger.js`) logging HTTP method, URL, and timestamp.
   - Content-Type Verification (`middleware/checkContentType.js`) rejecting POST/PUT without `Content-Type: application/json` (`415 Unsupported Media Type`).
   - Body Parser (`express.json()`).
   - Route-specific ID validator (`middleware/validateTaskId.js`) ensuring valid numeric format (`400`) and existence (`404`).
   - Custom 404 handler for undefined routes returning structured JSON.
   - Global Error Handler (`middleware/errorHandler.js`) catching unexpected exceptions and malformed JSON payloads without leaking server stack traces (`500`).

---

## 2. Project Directory Structure

```text
student-portfolio/
├── controllers/
│   └── taskController.js       # CRUD business logic and in-memory tasks array
├── middleware/
│   ├── logger.js               # Global request logger (Method, URL, Timestamp)
│   ├── checkContentType.js     # Validates Content-Type: application/json (415)
│   ├── validateTaskId.js       # Validates ID format (400) and existence (404)
│   └── errorHandler.js         # Safe global error handler (400 / 500)
├── routes/
│   └── tasks.js                # Express router mapping /tasks to controller methods
├── server.js                   # Main application entry point & middleware pipeline
├── test-api.js                 # Automated test runner testing all 12 scenarios
├── package.json                # Project dependencies and startup scripts
├── .gitignore                  # Excludes node_modules/ and .env
├── PRACTICAL_4_README.md       # Complete documentation & Viva Q&A
└── README.md                   # Main portfolio overview documentation
```

---

## 3. Middleware Execution Pipeline

Every HTTP request traverses the Express middleware pipeline in this exact order:

```
[ Incoming HTTP Request ]
          │
          ▼
1. logger (Global)
   Logs: [ISO Timestamp] METHOD URL
          │
          ▼
2. checkContentType (Global)
   If POST or PUT and Content-Type != application/json -> 415 Unsupported Media Type
          │
          ▼
3. express.json() (Global)
   Parses JSON body into req.body (Syntax errors caught by errorHandler)
          │
          ▼
4. Route Matchers:
   - GET  /                -> API Information route (200)
   - GET  /tasks           -> taskController.getAllTasks (200)
   - POST /tasks           -> taskController.createTask (201)
   - PUT  /tasks/:id       -> validateTaskId (400/404) -> taskController.updateTask (200)
   - DELETE /tasks/:id    -> validateTaskId (400/404) -> taskController.deleteTask (200)
   - GET  /simulate-error  -> Triggers next(new Error(...)) for 500 testing
          │
          ▼ (If no route matched)
5. Undefined Route 404 Handler
   Returns structured JSON: { success: false, error: "Cannot METHOD URL - Route not found" }
          │
          ▼ (If an error is thrown or passed via next(err))
6. errorHandler (Global Error-Handling Middleware)
   Returns safe JSON { success: false, error: message } without stack traces
```

---

## 4. REST API Endpoint Specification

### Base URL:
`http://localhost:5000`

| HTTP Method | Endpoint | Description | Request Body | Success Status | Error Statuses |
|---|---|---|---|---|---|
| **GET** | `/` | API Welcome & status info | None | `200 OK` | — |
| **GET** | `/tasks` | Retrieve all tasks | None | `200 OK` | `500` |
| **POST** | `/tasks` | Create a new task | `{ title, description?, completed? }` | `201 Created` | `400`, `415`, `500` |
| **PUT** | `/tasks/:id` | Update an existing task | `{ title?, description?, completed? }` | `200 OK` | `400`, `404`, `415`, `500` |
| **DELETE** | `/tasks/:id` | Delete a task by ID | None | `200 OK` | `400`, `404`, `500` |
| **GET** | `/any-invalid-route` | Undefined Route | Any | — | `404 Not Found` |
| **GET** | `/simulate-error` | Simulate internal error | None | — | `500 Internal Error` |

---

## 5. Sample Requests and Responses

### 1. GET /tasks — Fetch All Tasks
**Request:**
```http
GET http://localhost:5000/tasks
Accept: application/json
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": 1,
      "title": "Complete Practical 1",
      "description": "React Component Architecture and Props",
      "completed": true
    },
    {
      "id": 2,
      "title": "Complete Practical 2",
      "description": "React State Management and React Router Navigation",
      "completed": true
    },
    {
      "id": 3,
      "title": "Complete Practical 3",
      "description": "GitHub REST API Integration with useState and useEffect",
      "completed": true
    },
    {
      "id": 4,
      "title": "Complete Practical 4",
      "description": "Build RESTful API with Node.js, Express, and Middleware",
      "completed": false
    }
  ]
}
```

---

### 2. POST /tasks — Create a Task
**Request:**
```http
POST http://localhost:5000/tasks
Content-Type: application/json

{
  "title": "Study Node.js Streams and Event Loop",
  "description": "Prepare for upcoming WDF internal examination",
  "completed": false
}
```

**Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 5,
    "title": "Study Node.js Streams and Event Loop",
    "description": "Prepare for upcoming WDF internal examination",
    "completed": false
  }
}
```

---

### 3. PUT /tasks/:id — Update a Task
**Request:**
```http
PUT http://localhost:5000/tasks/4
Content-Type: application/json

{
  "completed": true
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": 4,
    "title": "Complete Practical 4",
    "description": "Build RESTful API with Node.js, Express, and Middleware",
    "completed": true
  }
}
```

---

### 4. DELETE /tasks/:id — Delete a Task
**Request:**
```http
DELETE http://localhost:5000/tasks/5
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "id": 5,
    "title": "Study Node.js Streams and Event Loop",
    "description": "Prepare for upcoming WDF internal examination",
    "completed": false
  }
}
```

---

### 5. Error Responses

#### A. Missing Content-Type Header (`415 Unsupported Media Type`):
**Request:**
```http
POST http://localhost:5000/tasks
(Content-Type header omitted or set to text/plain)
```
**Response (`415 Unsupported Media Type`):**
```json
{
  "success": false,
  "error": "Unsupported Media Type: Content-Type header must be application/json"
}
```

#### B. Validation Error on Creation (`400 Bad Request`):
**Request:**
```http
POST http://localhost:5000/tasks
Content-Type: application/json

{
  "description": "Missing required title field"
}
```
**Response (`400 Bad Request`):**
```json
{
  "success": false,
  "error": "Validation Error: \"title\" is required and must be a non-empty string."
}
```

#### C. Non-Existent Task ID (`404 Not Found`):
**Request:**
```http
PUT http://localhost:5000/tasks/9999
Content-Type: application/json

{
  "title": "Updated Title"
}
```
**Response (`404 Not Found`):**
```json
{
  "success": false,
  "error": "Task with ID 9999 not found."
}
```

#### D. Invalid ID Format (`400 Bad Request`):
**Request:**
```http
DELETE http://localhost:5000/tasks/invalid-id-xyz
```
**Response (`400 Bad Request`):**
```json
{
  "success": false,
  "error": "Invalid task ID format. Task ID must be a positive integer."
}
```

#### E. Undefined Route (`404 Not Found`):
**Request:**
```http
GET http://localhost:5000/api/non-existent
```
**Response (`404 Not Found`):**
```json
{
  "success": false,
  "error": "Cannot GET /api/non-existent - Route not found."
}
```

#### F. Safe Global Error Response (`500 Internal Server Error`):
**Request:**
```http
GET http://localhost:5000/simulate-error
```
**Response (`500 Internal Server Error`):**
```json
{
  "success": false,
  "error": "Simulated unhandled internal server error"
}
```
*(Notice: No internal stack traces are leaked to the client).*

---

## 6. How to Run and Test in PowerShell

### Step 1: Install Dependencies
```powershell
npm install
```

### Step 2: Start the Express Server
```powershell
npm run server
# or
node server.js
```
Expected output:
```
=======================================================
 Practical 4: RESTful Task Management API Server
 Student: Max Patel (24IT070)
 Server is running on: http://localhost:5000
 Endpoints available:
   - GET    http://localhost:5000/tasks
   - POST   http://localhost:5000/tasks
   - PUT    http://localhost:5000/tasks/:id
   - DELETE http://localhost:5000/tasks/:id
=======================================================
```

### Step 3: Run the Automated Test Suite
Open a new PowerShell terminal and run:
```powershell
npm run test:api
# or
node test-api.js
```

### Automated Test Results (12/12 Passing):
```
====================================================
 Starting Practical 4 API Automated Test Suite
 Target Server: http://localhost:5000
====================================================

✅ PASS - 1. GET /tasks - Fetch all tasks (Status 200)
    Details: HTTP 200, Count: 4
✅ PASS - 2. POST /tasks - Create task with valid JSON (Status 201)
    Details: HTTP 201, Assigned Task ID: 5
✅ PASS - 3. PUT /tasks/5 - Update existing task (Status 200)
    Details: HTTP 200, Completed: true
✅ PASS - 4. DELETE /tasks/5 - Delete existing task (Status 200)
    Details: HTTP 200, Deleted Task ID: 5
✅ PASS - 5. PUT /tasks/99999 - Non-existent task ID (Status 404)
    Details: HTTP 404, Error: "Task with ID 99999 not found."
✅ PASS - 6. DELETE /tasks/abc-invalid - Invalid ID format (Status 400)
    Details: HTTP 400, Error: "Invalid task ID format. Task ID must be a positive integer."
✅ PASS - 7. POST /tasks without JSON Content-Type (Status 415)
    Details: HTTP 415, Error: "Unsupported Media Type: Content-Type header must be application/json"
✅ PASS - 8. PUT /tasks/1 without JSON Content-Type (Status 415)
    Details: HTTP 415, Error: "Unsupported Media Type: Content-Type header must be application/json"
✅ PASS - 9. POST /tasks with missing title validation (Status 400)
    Details: HTTP 400, Error: "Validation Error: "title" is required and must be a non-empty string."
✅ PASS - 10. POST /tasks with malformed JSON syntax (Status 400)
    Details: HTTP 400, Error: "Malformed JSON payload. Please verify request body syntax."
✅ PASS - 11. GET /api/non-existent-endpoint - Custom 404 Handler (Status 404)
    Details: HTTP 404, Error: "Cannot GET /api/non-existent-endpoint - Route not found."
✅ PASS - 12. GET /simulate-error - Global Error Handler without stack leak (Status 500)
    Details: HTTP 500, Error: "Simulated unhandled internal server error"

====================================================
 Summary: 12 / 12 tests passed.
====================================================

🎉 ALL TESTS PASSED SUCCESSFULLY!
```

---

## 7. College Practical Viva Questions & Simple Answers

### Q1: What is a RESTful API?
**Answer:** REST (Representational State Transfer) is an architectural style for designing networked applications. A RESTful API uses standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) to perform CRUD operations on resources identified by URIs, exchanging data typically in JSON format.

### Q2: What is Middleware in Express?
**Answer:** Middleware functions are functions that have access to the request object (`req`), response object (`res`), and the `next` function in the application’s request-response cycle. They can execute code, modify `req` and `res`, terminate the request, or call `next()` to pass control to the next middleware.

### Q3: Why is `next()` important in Express middleware?
**Answer:** If a middleware function does not send a response back to the client (`res.json()`, `res.send()`), it **must** call `next()` to hand off control to the next middleware in the pipeline. If `next()` is omitted, the request is left hanging until the client times out.

### Q4: How does Express distinguish an Error-Handling middleware from normal middleware?
**Answer:** An error-handling middleware accepts **four arguments** instead of three: `(err, req, res, next)`. Express specifically looks at the function's arity (`fn.length === 4`) to identify it as an error handler.

### Q5: What is the purpose of `express.json()`?
**Answer:** `express.json()` is a built-in Express middleware that parses incoming HTTP requests with JSON payloads (based on `body-parser`) and populates `req.body` with the parsed JavaScript object.

### Q6: What does HTTP Status Code 415 represent?
**Answer:** `415 Unsupported Media Type` indicates that the server refuses to accept the request because the payload format is in an unsupported format (for instance, missing or invalid `Content-Type: application/json` header on a POST or PUT request).

### Q7: What is the difference between HTTP Status Code 400 and 404?
**Answer:** 
- `400 Bad Request`: The client sent an invalid request (e.g., malformed JSON syntax, missing required fields like `title`, or an invalid non-numeric task ID).
- `404 Not Found`: The requested resource or URI does not exist on the server (e.g., requesting task ID `99999` or an undefined route like `/api/unknown`).

### Q8: Why should error handling middleware NOT expose stack traces in production?
**Answer:** Exposing stack traces (`err.stack`) to clients reveals internal server architecture, file paths, library versions, and database schemas, which creates severe security vulnerabilities for malicious attackers. Returning a sanitized message prevents information disclosure.

### Q9: Why use route-specific middleware like `validateTaskId`?
**Answer:** Route-specific middleware keeps controllers focused strictly on business logic (Single Responsibility Principle). By verifying that `:id` is valid and the task exists before reaching the controller, code duplication is eliminated across `PUT` and `DELETE` routes.

### Q10: What is the difference between `PUT` and `PATCH`?
**Answer:** `PUT` replaces or fully updates an existing resource, while `PATCH` applies partial modifications to a resource. In our API, `PUT` updates the specified fields of the existing task.

### Q11: What is the difference between `200 OK` and `201 Created`?
**Answer:** 
- `200 OK`: Indicates standard successful completion of the request (used for `GET`, `PUT`, and `DELETE`).
- `201 Created`: Indicates that the request succeeded and resulted in the creation of a new resource (standard for `POST /tasks`).

### Q12: Why do we place the 404 handler after all routes but before the error handler?
**Answer:** Express executes middleware sequentially. If a request does not match any defined route handler above it, it naturally falls through to the 404 middleware. Placing the 404 handler before the error handler ensures undefined paths are caught, and placing the error handler last ensures any error thrown anywhere in the app can be caught.

---

## 8. Git & Repository Information

- **Repository URL:** [https://github.com/max7199/task5-todoapp-maxpatel.git](https://github.com/max7199/task5-todoapp-maxpatel.git)
- **Git Rules:**
  - `node_modules/` and `.env` are strictly excluded via `.gitignore`.
  - All practicals (1, 2, 3, and 4) are preserved and compatible.
