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

### Practical 7: Authentication and Middleware Pipeline
- Stateless authentication with **JSON Web Tokens (JWT)** and **Bcrypt** password hashing (10 salt rounds).
- Mongoose User Model (`models/User.js`) with unique, normalized email and safe serialization excluding password hashes.
- Authentication endpoints:
  - `POST /register`: Validates email/password, prevents duplicates, hashes password, returns HTTP 201.
  - `POST /login`: Validates credentials, compares bcrypt hash, generates 1-hour signed JWT, returns HTTP 200.
  - `GET /me`: Protected profile endpoint returning safe user details.
- Robust Express Middleware Pipeline:
  - `authMiddleware.js`: Validates `Authorization: Bearer <token>`, verifies JWT against `process.env.JWT_SECRET`, attaches `req.user`, and handles expired/malformed tokens without crashing.
  - `validation.js`: Reusable input validation for email format, password minimum length, and task title whitespace rules.
- Strict Multi-Tenant Data Isolation:
  - All task operations are scoped strictly to `req.user.id`.
  - User A cannot view, update, or delete User B's tasks (returns 404).
- React Frontend Authentication Integration:
  - Clean `AuthCard.jsx` with Login and Registration tabs.
  - Session state managed via `sessionStorage` with safe token storage.
  - Dynamic user status bar in `Tasks.jsx` displaying active email and `/me` verification button.
  - Automatic session teardown and 401 handling upon logout or expired token.
- Automated test suite (`test-practical7.js` / `npm run test:p7`) verifying all 20 security and CRUD scenarios.
- 12 authentic screenshots captured in `screenshots/P7/`.

### Practical 8: Performance Optimization and Lazy Loading in React
- Route-based code splitting using **`React.lazy()`** and dynamic ES modules for `/projects` (`Projects.jsx`) and `/contact` (`Contact.jsx`).
- Route-level **`<Suspense>`** boundaries with accessible loading indicators (`LoadingFallback.jsx`) implementing `role="status"` and `aria-live="polite"`.
- Lazy-loaded heavy feature component: **`TaskAnalytics.jsx`** dynamically fetched inside the Task Management dashboard (`Tasks.jsx`) to compute on-demand KPI metrics, completion progress bars, priority distribution, and velocity score without blocking initial dashboard load.
- Re-render optimization with **`React.memo`** preventing avoidable re-renders during keystrokes in task search filter input (verified 0.0 ms commit time in React DevTools Profiler).
- Baseline vs. Post-Optimization verification:
  - Monolithic 219.19 kB bundle split into reduced 213.90 kB main entry bundle + 3 dynamic on-demand chunks (`Projects`: 3.44 kB, `Contact`: 3.99 kB, `TaskAnalytics`: 3.23 kB).
  - Verified on-demand HTTP chunk downloads and visible fallback under Slow 3G network simulation.
  - Zero regression across all previous Practicals 1–7.
- Detailed documentation: [docs/PRACTICAL_8.md](docs/PRACTICAL_8.md) and [PRACTICAL_8_README.md](PRACTICAL_8_README.md).
- 12 authentic screenshots captured in `screenshots/P8/`.

### Practical 9: In-Memory Caching and Query Optimization
- In-memory key-value caching layer using **`node-cache`** (60s default TTL, 120s checkperiod) for `GET /tasks` and `GET /tasks/:id`.
- Strict **multi-tenant user isolation**: cache keys scoped exclusively to the authenticated user's ID (`tasks:user:<userId>` and `task:user:<userId>:<taskId>`), completely eliminating cross-tenant data leakage.
- Automatic **post-write cache invalidation**: every successful `POST /tasks`, `PUT /tasks/:id`, and `DELETE /tasks/:id` immediately invalidates the user's task-list and single-task cache to guarantee strong read-after-write consistency.
- Cache monitoring and debug endpoint: **`GET /debug/cache`** exposes real-time hit/miss counters, hit ratio percentage, and active key count without leaking private data; **`POST /debug/cache/reset`** provides a clean test reset mechanism.
- Performance Benchmark:
  - Uncached MongoDB queries: **3.05 ms** average (`X-Cache: MISS`).
  - In-memory cached queries: **1.39 ms** average (`X-Cache: HIT`).
  - Measured speedup: **2.19x faster throughput** (54.4% latency reduction).
- Automated test suite (`test-practical9.js` / `npm run test:p9`) verifying all 13 caching, invalidation, user isolation, and benchmark scenarios (100% green).
- Detailed documentation: [docs/PRACTICAL_9.md](docs/PRACTICAL_9.md) and [PRACTICAL_9_README.md](PRACTICAL_9_README.md).
- 10 authentic screenshots captured in `screenshots/P9/`.

### Practical 10: Asynchronous Processing with Event-Driven Architecture
- Asynchronous processing with Node.js's native **`EventEmitter`** (`node:events`) without external dependencies.
- Centralized event emitter instance in `events/taskEvents.js` and decoupled background listener in `events/taskListeners.js` subscribing to `'task-created'`.
- Background notification listener execution deferred to the event loop's check phase via **`setImmediate()`**, ensuring the HTTP response is never blocked.
- Immediate `HTTP 201 Created` (~3.88 ms) returned to client while notification details are processed in the background.
- Dual timestamp logging:
  - API response timestamp: `[API RESPONSE] Task created successfully at: ...`
  - Background handler timestamp: `[BACKGROUND NOTIFICATION] Processing task-created event at: ...`
- Strict security & validation: events emitted strictly after database document persistence (`await Task.create()`); failed validations (HTTP 400) and unauthorized requests (HTTP 401) emit zero events.
- Automated test suite (`test-practical10.js` / `npm run test:p10`) verifying all 9 asynchronous, dispatching, and security scenarios (100% green).
- Detailed documentation: [docs/PRACTICAL_10.md](docs/PRACTICAL_10.md) and [PRACTICAL_10_README.md](PRACTICAL_10_README.md).
- 11 authentic screenshots captured in `screenshots/P10/`.

### Practical 11: Containerization with Docker and Docker Compose
- Full-stack containerization and multi-container orchestration using **Docker** and **Docker Compose** (v3.8).
- **Backend Container (`Dockerfile.backend`):** Production `node:20-alpine` image with layer caching (`npm ci --omit=dev`), automated healthchecks, and non-root execution practices.
- **Frontend Container (`Dockerfile.frontend`):** Multi-stage build (Node.js 20 build stage compiling Vite bundle + `nginx:alpine` runtime web server serving static assets).
- **Nginx Reverse Proxy (`nginx.conf`):** Proxies `/api/` requests to `http://backend:5000/api/` over internal Docker network, eliminating browser CORS issues, and provides `try_files $uri $uri/ /index.html` fallback for React Router SPA navigation.
- **Persistent Storage:** MongoDB 7.0 container configured with persistent named volume `taskmanager_mongo_data` mounted to `/data/db`, ensuring zero data loss across container teardown.
- **Container Health Dependency:** Strict startup orchestration where `backend` waits for `mongo` to be healthy, and `frontend` waits for `backend` to be healthy.
- **Security:** `.dockerignore` excludes `node_modules`, `.git`, and `.env` secrets; `.env.docker.example` provides a safe template.
- **One-Command Startup:** Entire multi-tier stack launches seamlessly via `docker compose up --build`.
- Automated test suite (`test-practical11.js` / `npm run test:p11`) verifying all 8 Docker specification, reverse proxy, and API lifecycle scenarios (100% green).
- Detailed documentation: [docs/PRACTICAL_11.md](docs/PRACTICAL_11.md) and [PRACTICAL_11_README.md](PRACTICAL_11_README.md).
- 14 authentic screenshots captured in `screenshots/P11/`.

---

## File Structure

```text
student-portfolio/
├── backend/                    # Practical 11: Backend container specifications
│   ├── Dockerfile              # Node.js 20 Alpine production backend image
│   └── .dockerignore           # Excludes local node_modules and .env
├── controllers/
│   ├── authController.js       # Practical 7: Registration, login, & /me controller
│   └── taskController.js       # Practical 5/7/10: Task CRUD with cache & event emission
├── dist/                       # Production build output
├── events/                     # Practical 10: Event-Driven Architecture
│   ├── taskEvents.js           # Shared Node.js EventEmitter instance
│   └── taskListeners.js        # Background notification listener with setImmediate()
├── frontend/                   # Practical 11: Frontend container specifications
│   ├── Dockerfile              # Multi-stage React Vite build + Nginx Alpine
│   ├── nginx.conf              # SPA routing & /api/ reverse proxy
│   └── .dockerignore           # Excludes local node_modules and .env
├── middleware/
│   ├── authMiddleware.js       # Practical 7: JWT Bearer token authentication middleware
│   ├── validation.js           # Practical 7: Server-side input validation middleware
│   ├── logger.js               # Global request logger (Method, URL, Timestamp)
│   ├── checkContentType.js     # Validates Content-Type: application/json (415)
│   ├── validateTaskId.js       # Validates MongoDB ObjectId (400)
│   └── errorHandler.js         # Safe error handler formatting Mongoose/JWT errors
├── models/
│   ├── User.js                 # Practical 7: Mongoose User schema & password hashing
│   └── Task.js                 # Practical 5/7: Mongoose schema with user reference
├── node_modules/               # Dependencies
├── public/                     # Static assets
├── routes/
│   ├── auth.js                 # Practical 7: Auth routes (/register, /login, /me)
│   ├── debug.js                # Practical 9/10: Cache & notification debug routes
│   └── tasks.js                # Protected task routes (GET, POST, PUT, DELETE)
├── screenshots/
│   ├── Practical 4/            # REST API screenshots
│   ├── Practical 5/            # MongoDB screenshots
│   ├── Practical 6/            # 12 Full-stack integration screenshots
│   ├── P7/                     # Practical 7: 12 Authentication & middleware screenshots
│   ├── P8/                     # Practical 8: 12 Performance & code splitting screenshots
│   ├── P9/                     # Practical 9: 10 In-memory caching & benchmark screenshots
│   ├── P10/                    # Practical 10: 11 Asynchronous event processing screenshots
│   └── P11/                    # Practical 11: 14 Docker containerization & orchestration screenshots
├── src/
│   ├── components/
│   │   ├── AuthCard.jsx        # Practical 7: Login & Registration form component
│   │   ├── LoadingFallback.jsx # Practical 8: Accessible Suspense loading fallback
│   │   ├── TaskAnalytics.jsx   # Practical 8: Lazy-loaded heavy analytics component (memoized)
│   │   ├── NavBar.jsx          # NavLink navigation + Tasks link + Dark/Light toggle
│   │   ├── Header.jsx          # Hero banner component
│   │   ├── About.jsx           # Personal bio & academic details grid
│   │   ├── Skills.jsx          # Dynamic skills list
│   │   ├── Projects.jsx        # Component preserved from Practical 1
│   │   ├── Footer.jsx          # Global footer with student credits
│   │   ├── Spinner.jsx         # CSS loading spinner for API requests
│   │   ├── ErrorMessage.jsx    # Error alert with Retry button
│   │   ├── RepoList.jsx        # GitHub repositories list with stars & links
│   │   ├── TaskForm.jsx        # Task creation & edit form
│   │   ├── TaskItem.jsx        # Task card with toggle, badge, & actions
│   │   ├── ConfirmModal.jsx    # Modal dialog for delete confirmation
│   │   └── Toast.jsx           # Toast notification alert stack
│   ├── pages/
│   │   ├── Home.jsx            # Route: '/' (Header, About, Skills)
│   │   ├── Projects.jsx        # Route: '/projects' (GitHub API integration)
│   │   ├── Tasks.jsx           # Route: '/tasks' (Practical 7 Protected Tasks page)
│   │   ├── Contact.jsx         # Route: '/contact' (Controlled form + useState)
│   │   └── NotFound.jsx        # Route: '*' (Custom 404 page)
│   ├── api.js                  # Centralized API client with JWT Bearer injection
│   ├── App.jsx                 # Router configuration & dark mode state
│   ├── App.css                 # Component styling, layouts, cards, and dark mode
│   ├── index.css               # Global design tokens and resets
│   └── main.jsx                # BrowserRouter wrapper entry point
├── utils/
│   └── cache.js                # Practical 9: Shared node-cache module with TTL & invalidation
├── .dockerignore               # Practical 11: Root Docker ignore patterns
├── .env                        # Local database URI, JWT secret, port (gitignored)
├── .env.example                # Template configuration file with placeholder secret
├── .env.docker.example         # Practical 11: Docker Compose environment template
├── Dockerfile.backend          # Practical 11: Production Node.js 20 backend containerfile
├── Dockerfile.frontend         # Practical 11: Multi-stage React Vite + Nginx containerfile
├── docker-compose.yml          # Practical 11: Multi-container orchestration specification
├── nginx.conf                  # Practical 11: Nginx SPA routing & API reverse proxy configuration
├── test-api.js                 # Practical 4: In-memory automated test suite
├── test-practical5.js          # Practical 5: MongoDB automated test suite
├── test-practical7.js          # Practical 7: Auth & middleware automated test suite
├── test-practical9.js          # Practical 9: In-memory caching & benchmark test suite
├── test-practical10.js         # Practical 10: Asynchronous event-driven test suite
├── test-practical11.js         # Practical 11: Docker specification & API test suite
├── server.js                   # Express + MongoDB + JWT Auth + Caching + Event listeners + Health
├── index.html                  # HTML host document
├── package.json                # Dependencies and scripts (added test:p11)
├── vite.config.js              # Vite configuration
├── .gitignore                  # Excludes node_modules, dist, .env, and logs
├── docs/
│   ├── PRACTICAL_8.md          # Practical 8: Performance & Lazy Loading in-depth documentation
│   ├── PRACTICAL_9.md          # Practical 9: In-Memory Caching in-depth documentation
│   ├── PRACTICAL_10.md         # Practical 10: Asynchronous Event-Driven Architecture documentation
│   └── PRACTICAL_11.md         # Practical 11: Containerization with Docker & Docker Compose docs
├── PRACTICAL_1_README.md       # Practical 1 Viva & Documentation
├── PRACTICAL_2_README.md       # Practical 2 Viva & Documentation
├── PRACTICAL_3_README.md       # Practical 3 Viva & Documentation
├── PRACTICAL_4_README.md       # Practical 4 Viva & Documentation
├── PRACTICAL_5_README.md       # Practical 5 Viva & Documentation
├── PRACTICAL_6_README.md       # Practical 6 Full-Stack Integration Viva & Docs
├── PRACTICAL_7_README.md       # Practical 7 Authentication & Middleware Viva & Docs
├── PRACTICAL_8_README.md       # Practical 8 Performance Optimization Viva & Docs
├── PRACTICAL_9_README.md       # Practical 9 In-Memory Caching Viva & Docs
├── PRACTICAL_10_README.md      # Practical 10 Asynchronous Event-Driven Viva & Docs
├── PRACTICAL_11_README.md      # Practical 11 Docker Containerization Viva & Docs
└── README.md                   # Project overview
```

---

## How to Run Locally

### Option A: Using Docker Compose (Recommended - Practical 11)
Start the complete full-stack application (frontend, backend, and MongoDB) using one command:
```powershell
# Build images and start all services
docker compose up --build

# Run in detached background mode
docker compose up --build -d

# Check running container statuses and health
docker compose ps

# View logs
docker compose logs -f

# Stop all containers safely (preserving database data)
docker compose down
```

### Option B: Running Manually on Host Machine

#### 1. Start MongoDB Service
Ensure the MongoDB local daemon is running:
```powershell
Get-Service MongoDB
# If stopped:
Start-Service MongoDB
```

#### 2. Backend Server (Express + MongoDB + CORS)
Runs on `http://localhost:5000`:
```powershell
npm run server
# or
node server.js
```

#### 3. Frontend Application (React + Vite)
Runs on `http://localhost:5173`:
```powershell
npm run dev
```

Visit [http://localhost:5173/tasks](http://localhost:5173/tasks) to view the live full-stack Task Management interface.

#### 4. Build for Production
```powershell
npm run build
```

---

## Automated Tests

```powershell
# Run Practical 4 REST API test suite
npm run test:api

# Run Practical 5 MongoDB Mongoose test suite
npm run test:p5

# Run Practical 7 Authentication & Middleware Pipeline test suite
npm run test:p7

# Run Practical 9 In-Memory Caching & Benchmark test suite
npm run test:p9

# Run Practical 10 Asynchronous Event-Driven Architecture test suite
npm run test:p10

# Run Practical 11 Docker Specification & Containerization test suite
npm run test:p11
```
