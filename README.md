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
├── .env                        # Local database URI & port (gitignored)
├── .env.example                # Template configuration file
├── test-api.js                 # Practical 4: In-memory automated test suite
├── test-practical5.js          # Practical 5: MongoDB automated test suite
├── server.js                   # Practical 5: Database connection & Express server
├── index.html                  # HTML host document
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── .gitignore                  # Excludes node_modules, dist, .env, and logs
├── PRACTICAL_1_README.md       # Practical 1 Viva & Documentation
├── PRACTICAL_2_README.md       # Practical 2 Viva & Documentation
├── PRACTICAL_3_README.md       # Practical 3 Viva & Documentation
├── PRACTICAL_4_README.md       # Practical 4 Viva & Documentation
├── PRACTICAL_5_README.md       # Practical 5 Viva & Documentation
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

### Backend (Practical 5 MongoDB & Express REST API)
```powershell
# 1. Ensure local MongoDB service is running
Get-Service MongoDB

# 2. Start the Express & MongoDB server (Port 5000)
npm run server
# or
node server.js

# 3. Run Practical 5 Automated Test Suite (12/12 Tests)
npm run test:p5
# or
node test-practical5.js
```
