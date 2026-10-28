# Student Portfolio — Web Development Frameworks (WDF)

- **Student Name:** Max Patel
- **Roll Number:** 24IT070
- **Course:** Advanced Web Development Frameworks (ITUE301)
- **Institution:** Charotar University of Science and Technology (CHARUSAT)
- **Repository Name:** `SEM5WDF`
- **Repository URL:** [https://github.com/max7199/SEM5WDF](https://github.com/max7199/SEM5WDF)
- **Course Outcome:** CO1
- **Program Outcomes:** PO3, PO5
- **Technology Stack:** React 18, Vite 5, React Router, GitHub REST API, Node.js, Express, MongoDB, Mongoose

---

## Practicals Overview

### Practical 1: Introduction to React & Component Architecture
- Functional React components (`Header`, `About`, `Skills`, `Projects`, `Footer`).
- JSX syntax and semantic HTML structure.
- Unidirectional data flow and parent-to-child communication via **props**.
- Dynamic rendering of lists with JavaScript `.map()` and unique keys.
- Inline styles driven dynamically by props (`themeColor`).

### Practical 2: React State Management & Multi-Page Navigation
- Client-side navigation using **React Router** (`react-router-dom`).
- Route definitions for `/` (Home), `/projects` (Projects), `/contact` (Contact), and `*` (404 Page Not Found).
- Active route highlighting using `NavLink`.
- Interactive state management using `useState`:
  - Controlled Contact form input.
  - Real-time character counting.
  - Live preview panel updating synchronously on keystrokes.
  - Clear message reset action.
  - Visibility toggle for help instructions box.
  - Global Dark / Light mode toggle.

### Practical 3: API Integration & Data Rendering in React
- Integration with the public **GitHub REST API** (`https://api.github.com/users/max7199/repos?per_page=100`).
- The **Projects page** retrieves and renders live public GitHub repositories dynamically for `@max7199`.
- Component lifecycle management using React's **`useEffect`** hook to fetch data on component mount.
- Triple-state reactive management using **`useState`**:
  - `loading`: Displays an accessible CSS `<Spinner />` with `"Loading repositories..."`.
  - `error`: Displays a clear `<ErrorMessage />` with a functional **Retry Request** button.
  - `repos`: Displays live repository cards via `<RepoList />` with star counts, languages, and direct GitHub links.
- Real-time case-insensitive **search filter** allowing users to search repositories by name.

### Practical 4: Building a RESTful API with Node.js and Express
- Modular RESTful API architecture (`server.js`, `routes/`, `controllers/`, `middleware/`).
- In-memory array data model with full CRUD functionality (`GET`, `POST`, `PUT`, `DELETE`).
- Complete middleware pipeline (Logger, Content-Type verification, `express.json()`, ID validation, 404 handler, Global error handler).
- Automated test runner (`test-api.js` / `npm run test:api`) covering all 12 test cases.

### Practical 5: MongoDB Integration and Schema Design with Mongoose
- Production-grade database connectivity to MongoDB using **Mongoose** and **dotenv**.
- Strictly validated Mongoose Task Schema (`models/Task.js`):
  - `title`: String, required, trimmed.
  - `description`: String, default `""`.
  - `completed`: Boolean, default `false`.
  - `createdAt`: Date, default `Date.now`.
  - `priority`: Enum `['low', 'medium', 'high']`, default `'medium'`.
  - Pre-save hook enforcing whitespace trimming.
- Database-backed CRUD endpoints (`Task.find()`, `Task.findById()`, `Task.create()`, `Task.findByIdAndUpdate()`, `Task.findByIdAndDelete()`).
- Structured error handling: Mongoose `ValidationError` and `CastError` formatted into clean JSON without leaking stack traces.
- Automated database test runner (`test-practical5.js` / `npm run test:p5`) covering all 12 scenarios.
- Verified data persistence across server restarts in local MongoDB `taskmanager` database.

### Practical 6: Full Stack Integration (React + Node.js + MongoDB)
- Complete end-to-end integration connecting the React frontend (`http://localhost:5173`) with the Express backend (`http://localhost:5000`) and MongoDB.
- Cross-Origin Resource Sharing (**CORS**) enabled in `server.js` using the `cors` middleware.
- Centralized API abstraction layer (`src/api.js`) configuring `VITE_API_BASE_URL` with robust HTTP error handling and status code verification (`getTasks`, `getTask`, `createTask`, `updateTask`, `deleteTask`).
- Reactive Task Management UI (`src/pages/Tasks.jsx`):
  - Live task listing with status toggle, priority badges, and formatted dates.
  - Task creation form (`TaskForm.jsx`) with input validation and supplementary optimistic UI preview.
  - Task editing modal/form for title, description, and priority updates.
  - Delete action with custom confirmation modal (`ConfirmModal.jsx`) protecting against accidental deletions.
  - Non-blocking auto-dismissing toast notifications (`Toast.jsx`) for success, info, and error feedback.
  - Search filter and multi-criteria sorting (by completion status and priority level).
  - Graceful triple-state loading and network error handling with retry buttons (`Spinner.jsx`, `ErrorMessage.jsx`).
  - Verified persistence in MongoDB after full page refreshes.

---

## File Structure

```text
student-portfolio/
├── controllers/
│   └── taskController.js       # Practical 5: Mongoose CRUD controller
├── dist/                       # Production build output
├── middleware/
│   ├── logger.js               # Global request logger (Method, URL, Timestamp)
│   ├── checkContentType.js     # Validates Content-Type: application/json (415)
│   ├── validateTaskId.js       # Validates MongoDB ObjectId (400)
│   └── errorHandler.js         # Safe error handler formatting Mongoose errors
├── models/
│   └── Task.js                 # Practical 5: Mongoose schema and pre-save hook
├── node_modules/               # Dependencies
├── public/                     # Static assets
├── routes/
│   └── tasks.js                # Task routes (GET, POST, PUT, DELETE)
├── screenshots/
│   ├── Practical 4/            # REST API screenshots
│   ├── Practical 5/            # MongoDB screenshots
│   └── Practical 6/            # 12 Full-stack integration screenshots
├── src/
│   ├── components/
│   │   ├── NavBar.jsx          # NavLink navigation + Tasks link + Dark/Light toggle
│   │   ├── Header.jsx          # Hero banner component
│   │   ├── About.jsx           # Personal bio & academic details grid
│   │   ├── Skills.jsx          # Dynamic skills list
│   │   ├── Projects.jsx        # Component preserved from Practical 1
│   │   ├── Footer.jsx          # Global footer with student credits
│   │   ├── Spinner.jsx         # CSS loading spinner for API requests
│   │   ├── ErrorMessage.jsx    # Error alert with Retry button
│   │   ├── RepoList.jsx        # GitHub repositories list with stars & links
│   │   ├── TaskForm.jsx        # Practical 6: Task creation & edit form
│   │   ├── TaskItem.jsx        # Practical 6: Task card with toggle, badge, & actions
│   │   ├── ConfirmModal.jsx    # Practical 6: Modal dialog for delete confirmation
│   │   └── Toast.jsx           # Practical 6: Toast notification alert stack
│   ├── pages/
│   │   ├── Home.jsx            # Route: '/' (Header, About, Skills)
│   │   ├── Projects.jsx        # Route: '/projects' (GitHub API integration)
│   │   ├── Tasks.jsx           # Route: '/tasks' (Practical 6 Full-stack Tasks page)
│   │   ├── Contact.jsx         # Route: '/contact' (Controlled form + useState)
│   │   └── NotFound.jsx        # Route: '*' (Custom 404 page)
│   ├── api.js                  # Practical 6: Centralized API client functions
│   ├── App.jsx                 # Router configuration & dark mode state
│   ├── App.css                 # Component styling, layouts, cards, and dark mode
│   ├── index.css               # Global design tokens and resets
│   └── main.jsx                # BrowserRouter wrapper entry point
├── .env                        # Local database URI, port, & API base URL (gitignored)
├── .env.example                # Template configuration file
├── test-api.js                 # Practical 4: In-memory automated test suite
├── test-practical5.js          # Practical 5: MongoDB automated test suite
├── server.js                   # Practical 5/6: Express + MongoDB + CORS server
├── index.html                  # HTML host document
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── .gitignore                  # Excludes node_modules, dist, .env, and logs
├── PRACTICAL_1_README.md       # Practical 1 Viva & Documentation
├── PRACTICAL_2_README.md       # Practical 2 Viva & Documentation
├── PRACTICAL_3_README.md       # Practical 3 Viva & Documentation
├── PRACTICAL_4_README.md       # Practical 4 Viva & Documentation
├── PRACTICAL_5_README.md       # Practical 5 Viva & Documentation
├── PRACTICAL_6_README.md       # Practical 6 Full-Stack Integration Viva & Docs
└── README.md                   # Project overview
```

---

## How to Run Locally

### 1. Start MongoDB Service
Ensure the MongoDB local daemon is running:
```powershell
Get-Service MongoDB
# If stopped:
Start-Service MongoDB
```

### 2. Backend Server (Express + MongoDB + CORS)
Runs on `http://localhost:5000`:
```powershell
npm run server
# or
node server.js
```

### 3. Frontend Application (React + Vite)
Runs on `http://localhost:5173`:
```powershell
npm run dev
```

Visit [http://localhost:5173/tasks](http://localhost:5173/tasks) to view the live full-stack Task Management interface.

### 4. Build for Production
```powershell
npm run build
```
