# Practical 6: Full Stack Integration (React + Node.js + MongoDB)

- **Student Name:** Max Patel
- **Roll Number:** 24IT070
- **Course:** Advanced Web Development Frameworks (ITUE301)
- **Institution:** Charotar University of Science and Technology (CHARUSAT)
- **Repository URL:** [https://github.com/max7199/SEM5WDF](https://github.com/max7199/SEM5WDF)
- **Course Outcomes:** CO1, CO2
- **Program Outcomes:** PO3, PO5
- **Technology Stack:** React 18, Vite 5, Node.js, Express.js, MongoDB, Mongoose, CORS, CSS3

---

## 1. Practical Aim & Objectives

The goal of Practical 6 is to unite the components from Practicals 1 through 5 into an end-to-end, production-grade **Full-Stack Task Management Application**.

### Architecture:
```
[ React 18 SPA (Vite) ]   <─── Port 5173 ───>   Browser Client
        │
        │ HTTP REST Requests (Fetch with JSON / CORS)
        ▼
[ Node.js + Express API ] <─── Port 5000 ───>   REST Endpoints (/tasks)
        │
        │ Mongoose ODM
        ▼
[ MongoDB Database ]      <─── Port 27017 ──>   Collection: taskmanager.tasks
```

### Key Deliverables & Features:
1. **Centralized React API Utility (`src/api.js`):** Unified asynchronous fetch service with configurable `VITE_API_BASE_URL`, status code verification, and user-friendly error formatting.
2. **CORS Configuration:** Seamless cross-origin resource sharing between the frontend (`http://localhost:5173`) and Express backend (`http://localhost:5000`).
3. **Full CRUD User Interface (`src/pages/Tasks.jsx`):**
   - **Read:** Live task list fetching documents from MongoDB, with priority badges and formatted timestamps.
   - **Create:** Validated task submission form with title, optional description, priority selection, and optimistic UI updates.
   - **Update:** Inline editing and one-click completion status toggling synchronized directly to MongoDB.
   - **Delete:** Interactive confirmation dialog modal preventing accidental deletions.
4. **State Management & Notifications:**
   - Real-time CSS loading spinners.
   - Network failure alerts with automatic "Retry" triggers.
   - Animated Toast notification system (`src/components/Toast.jsx`) providing non-blocking operation feedback.
5. **Persistence Across Refresh:** Confirmed that data resides strictly in MongoDB and persists seamlessly across browser reloads.

---

## 2. Project Directory Structure

```text
student-portfolio/
├── controllers/
│   └── taskController.js         # Backend Mongoose CRUD controllers
├── middleware/
│   ├── checkContentType.js       # Rejects non-JSON POST/PUT requests (415)
│   ├── errorHandler.js           # Sanitized error handler (no stack traces)
│   ├── logger.js                 # Global request logger
│   └── validateTaskId.js         # Validates MongoDB ObjectId format (400)
├── models/
│   └── Task.js                   # Mongoose schema, validation, pre-save hook
├── routes/
│   └── tasks.js                  # Express task router (GET, POST, PUT, DELETE)
├── screenshots/
│   ├── Practical 6/              # 12 Verified Practical 6 screenshots
│   │   ├── 01-react-task-list.png
│   │   ├── 02-create-task-form.png
│   │   ├── 03-create-task-success.png
│   │   ├── 04-update-task.png
│   │   ├── 05-delete-confirmation.png
│   │   ├── 06-delete-success.png
│   │   ├── 07-toast-notifications.png
│   │   ├── 08-loading-and-error-handling.png
│   │   ├── 09-data-persistence-after-refresh.png
│   │   ├── 10-backend-mongodb-connection.png
│   │   ├── 11-api-requests.png
│   │   └── 12-full-stack-project-structure.png
├── src/
│   ├── components/
│   │   ├── ConfirmModal.jsx      # Delete confirmation dialog modal
│   │   ├── TaskForm.jsx          # Task creation & editing form
│   │   ├── TaskItem.jsx          # Task card item with status toggle
│   │   ├── Toast.jsx             # Toast notification component
│   │   ├── NavBar.jsx            # Navigation bar with /tasks link
│   │   ├── Spinner.jsx           # Loading spinner
│   │   ├── ErrorMessage.jsx      # Error banner with Retry action
│   │   └── Footer.jsx            # Student credit footer
│   ├── pages/
│   │   ├── Home.jsx              # Route: '/'
│   │   ├── Projects.jsx          # Route: '/projects'
│   │   ├── Contact.jsx           # Route: '/contact'
│   │   ├── Tasks.jsx             # Route: '/tasks' (Practical 6 Full-Stack page)
│   │   └── NotFound.jsx          # Route: '*'
│   ├── api.js                    # Centralized React API service
│   ├── App.jsx                   # Multi-page router & dark mode state
│   └── App.css                   # Full application styles & responsive design
├── .env                          # Local credentials (gitignored)
├── .env.example                  # Template configuration file
├── package.json                  # Dependencies (cors, express, mongoose, react)
├── server.js                     # Express application & CORS configuration
├── PRACTICAL_5_README.md         # Practical 5 documentation
├── PRACTICAL_6_README.md         # Practical 6 Full-Stack documentation
└── README.md                     # Main portfolio overview
```

---

## 3. Configuration & Dependencies

### Backend Dependencies:
- `express`: REST API web framework.
- `cors`: Enables Cross-Origin Resource Sharing.
- `mongoose`: MongoDB Object Data Modeling (ODM).
- `dotenv`: Loads environment variables.

### Frontend Dependencies:
- `react`, `react-dom`: UI component rendering.
- `react-router-dom`: Client-side multi-page routing.
- `vite`: Development server and production bundler.

### Environment Setup (`.env.example`):
```env
# MongoDB Connection URI (Local or Atlas)
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager

# Server Port
PORT=5000

# Frontend API Base URL for React Vite app
VITE_API_BASE_URL=http://localhost:5000
```

---

## 4. Centralized API Utility (`src/api.js`)

All network communication is isolated in `src/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function getTasks() {
  return await request('/tasks');
}

export async function createTask(taskData) {
  return await request('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData)
  });
}

export async function updateTask(id, taskData) {
  return await request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData)
  });
}

export async function deleteTask(id) {
  return await request(`/tasks/${id}`, {
    method: 'DELETE'
  });
}
```

---

## 5. End-to-End CRUD Workflow

1. **Viewing Tasks (Read):**
   - On page mount, `loadTasks()` calls `getTasks()`.
   - The UI displays an accessible `<Spinner />` until MongoDB responds with the document array.
   - Tasks render with dynamic priority badges (`🔴 High`, `🟡 Medium`, `🟢 Low`) and timestamps.
2. **Creating Tasks (Create):**
   - The user fills out the `TaskForm` on the left.
   - An optimistic preview card is inserted into the task list.
   - `createTask()` executes `POST http://localhost:5000/tasks`.
   - On success, the confirmed MongoDB record replaces the preview and a green success Toast alert appears.
3. **Updating Tasks (Update):**
   - Clicking `✏️ Edit` loads the task into the form for title, description, or priority modification.
   - Clicking the completion checkbox triggers an instant `PUT /tasks/:id` updating `completed: true/false`.
4. **Deleting Tasks (Delete):**
   - Clicking `🗑️ Delete` opens the `ConfirmModal`.
   - If "Cancel" is clicked, no request is sent.
   - If "Delete Task" is confirmed, `DELETE /tasks/:id` removes the document from MongoDB, removes the card from the UI, and displays a success toast.

---

## 6. How to Run Locally

### Terminal 1: Start Backend (Express + MongoDB)
```powershell
# In D:\5THSEM WDF\PRATICAL
npm run server
```
*Expected log:*
```text
MongoDB Connected Successfully!
Host: 127.0.0.1 | Database: taskmanager
Practical 6 Full-Stack API running at: http://localhost:5000
```

### Terminal 2: Start Frontend (React + Vite)
```powershell
# In D:\5THSEM WDF\PRATICAL
npm run dev
```
*Access the application at:* `http://localhost:5173/tasks`

---

## 7. Screenshot Documentation Index

All screenshots are stored inside:
`D:\5THSEM WDF\PRATICAL\screenshots\Practical 6\`

| File | Feature Demonstrated |
|---|---|
| `01-react-task-list.png` | Live React task management page showing real MongoDB tasks |
| `02-create-task-form.png` | Validated task creation form before submission |
| `03-create-task-success.png` | Newly created task with success toast alert |
| `04-update-task.png` | Task editing interface and confirmed update |
| `05-delete-confirmation.png` | Deletion confirmation modal dialog |
| `06-delete-success.png` | UI after task deletion with success toast |
| `07-toast-notifications.png` | Real-time toast alert stack (Success, Info, Error) |
| `08-loading-and-error-handling.png` | CSS loading spinner and error retry banner |
| `09-data-persistence-after-refresh.png` | Browser after refresh confirming data persistence |
| `10-backend-mongodb-connection.png` | PowerShell terminal showing MongoDB connection and CORS |
| `11-api-requests.png` | DevTools Network tab showing genuine 2xx REST requests |
| `12-full-stack-project-structure.png` | VS Code Explorer displaying full-stack architecture |

---

## 8. College Viva Questions & Answers for Practical 6

### Q1: What is Cross-Origin Resource Sharing (CORS) and why is it needed in a full-stack MERN application?
**Answer:** By default, browsers enforce the Same-Origin Policy (SOP), which blocks web pages loaded from one origin (`http://localhost:5173`) from making fetch requests to a different origin (`http://localhost:5000`). The `cors` middleware in Express adds HTTP response headers such as `Access-Control-Allow-Origin: *`, allowing the React frontend to communicate with the Express backend safely.

### Q2: What is Optimistic UI and why is it useful?
**Answer:** Optimistic UI is a frontend design pattern where the user interface updates immediately under the assumption that the backend operation will succeed, rather than waiting for the network round-trip to finish. If the backend subsequently returns an error, the interface reverts the change and displays an error message. This makes web applications feel instant and responsive.

### Q3: Why is a centralized API utility (`api.js`) preferred over calling `fetch()` directly in components?
**Answer:** Centralizing API logic adheres to the Don't Repeat Yourself (DRY) principle and Single Responsibility Principle (SRP). It ensures:
1. Base URLs and headers are configured in one place.
2. Error handling and status code verification are consistent across all calls.
3. Component code remains focused purely on UI rendering and local state management.

### Q4: How does data persistence work across browser refreshes in this project?
**Answer:** When the user refreshes the browser, React component state is reset. The `useEffect` hook in `Tasks.jsx` runs on mount and executes `getTasks()`, sending an HTTP GET request to `/tasks`. The Express backend queries MongoDB (`Task.find()`), and the stored documents are sent back and loaded into React state, ensuring data is never lost.

### Q5: Why is a confirmation dialog necessary before performing a DELETE operation?
**Answer:** Deletion is a destructive and irreversible operation. Asking for explicit confirmation prevents accidental data loss caused by accidental clicks.

---

## 9. Verification Summary

- **Backend Status:** Express server running on port `5000` with CORS enabled.
- **Database Status:** Connected to local MongoDB (`127.0.0.1:27017/taskmanager`).
- **Frontend Status:** React 18 + Vite running on port `5173` with full CRUD support on `/tasks`.
- **Previous Practicals:** Practicals 1, 2, 3, 4, and 5 preserved and fully operational.
- **Screenshots:** All 12 screenshots verified in `screenshots/Practical 6/`.
- **Repository:** [https://github.com/max7199/SEM5WDF](https://github.com/max7199/SEM5WDF).
