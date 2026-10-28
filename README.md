# Student Portfolio — Web Development Frameworks (WDF)

- **Student Name:** Max Patel
- **Roll Number:** 24IT070
- **Repository Name:** `task5-todoapp-maxpatel`
- **Repository URL:** [https://github.com/max7199/task5-todoapp-maxpatel.git](https://github.com/max7199/task5-todoapp-maxpatel.git)
- **Course Outcome:** CO1
- **Program Outcomes:** PO3, PO5
- **Technology Stack:** React 18, Vite 5, React Router, GitHub REST API, Vanilla CSS3

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
- In-memory array data model with full CRUD functionality:
  - `GET /tasks`: Retrieve all tasks (Status `200 OK`).
  - `POST /tasks`: Create a new task (Status `201 Created`).
  - `PUT /tasks/:id`: Update an existing task (Status `200 OK`).
  - `DELETE /tasks/:id`: Delete an existing task (Status `200 OK`).
- Complete middleware pipeline:
  - Global Request Logger (`middleware/logger.js`) logging HTTP method, URL, and timestamp.
  - Content-Type Verification (`middleware/checkContentType.js`) rejecting POST/PUT without `Content-Type: application/json` (`415 Unsupported Media Type`).
  - Body Parser (`express.json()`).
  - Route-specific ID validator (`middleware/validateTaskId.js`) ensuring valid numeric format (`400`) and existence (`404`).
  - Custom 404 handler for undefined routes.
  - Global Error Handler (`middleware/errorHandler.js`) catching syntax errors and exceptions safely without leaking stack traces (`500`).
- Comprehensive automated test runner (`test-api.js` / `npm run test:api`) covering all 12 test cases.

---

## File Structure

```text
student-portfolio/
├── controllers/
│   └── taskController.js       # Practical 4: CRUD controller & in-memory tasks
├── dist/                       # Production build output
├── middleware/
│   ├── logger.js               # Global request logger (Method, URL, Timestamp)
│   ├── checkContentType.js     # Validates Content-Type: application/json (415)
│   ├── validateTaskId.js       # Validates ID format (400) and existence (404)
│   └── errorHandler.js         # Safe global error handler (400 / 500)
├── node_modules/               # Dependencies
├── public/                     # Static assets
├── routes/
│   └── tasks.js                # Practical 4: Task routes
├── src/
│   ├── components/
│   │   ├── NavBar.jsx          # NavLink navigation + Dark/Light mode toggle
│   │   ├── Header.jsx          # Hero banner component
│   │   ├── About.jsx           # Personal bio & academic details grid
│   │   ├── Skills.jsx          # Dynamic skills list
│   │   ├── Projects.jsx        # Component preserved from Practical 1
│   │   ├── Footer.jsx          # Global footer with student credits
│   │   ├── Spinner.jsx         # CSS loading spinner for API requests
│   │   ├── ErrorMessage.jsx    # Error alert with Retry button
│   │   └── RepoList.jsx        # GitHub repositories list with stars & links
│   ├── pages/
│   │   ├── Home.jsx            # Route: '/' (Header, About, Skills)
│   │   ├── Projects.jsx        # Route: '/projects' (GitHub API integration)
│   │   ├── Contact.jsx         # Route: '/contact' (Controlled form + useState)
│   │   └── NotFound.jsx        # Route: '*' (Custom 404 page)
│   ├── App.jsx                 # Router configuration & dark mode state
│   ├── App.css                 # Component styling, layouts, cards, and dark mode
│   ├── index.css               # Global design tokens and resets
│   └── main.jsx                # BrowserRouter wrapper entry point
├── test-api.js                 # Practical 4: Automated test suite
├── server.js                   # Practical 4: Express server & middleware pipeline
├── index.html                  # HTML host document
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── .gitignore                  # Excludes node_modules, dist, .env, and logs
├── PRACTICAL_1_README.md       # Practical 1 Viva & Documentation
├── PRACTICAL_2_README.md       # Practical 2 Viva & Documentation
├── PRACTICAL_3_README.md       # Practical 3 Viva & Documentation
├── PRACTICAL_4_README.md       # Practical 4 Viva & Documentation
└── README.md                   # Project overview
```

---

## How to Run Locally

### Frontend (React + Vite)
```powershell
# 1. Install dependencies
npm install

# 2. Run the Vite development server (Port 5173)
npm run dev

# 3. Build for production
npm run build
```

### Backend (Practical 4 Express REST API)
```powershell
# 1. Start Express Server (Port 5000)
npm run server
# or
node server.js

# 2. Run Automated API Test Suite
npm run test:api
# or
node test-api.js
```
