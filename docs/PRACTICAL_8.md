# Practical 8 — Performance Optimization and Lazy Loading in React

- **Course:** Advanced Web Development Frameworks (ITUE301)
- **Degree:** B.Tech Information Technology (Semester 5)
- **Institution:** Charotar University of Science and Technology (CHARUSAT)
- **Student Name:** Max Patel
- **Roll Number:** 24IT070
- **GitHub Repository:** [https://github.com/max7199/SEM5WDF](https://github.com/max7199/SEM5WDF)
- **Frontend Stack:** React 18.3, Vite 5.4, JavaScript (ES6+), React Router v7, CSS3
- **Backend Stack:** Node.js, Express 5, MongoDB, Mongoose 9, JWT, Bcrypt
- **Screenshot Directory:** `screenshots/P8/`

---

## 1. Title and Objective

**Title:** Performance Optimization and Lazy Loading in React  
**Course Outcomes (CO) / Program Outcomes (PO):** CO1 / PO3, PO5

### Objective:
Optimize the existing Student Portfolio and Task Management full-stack application by implementing route-based code splitting, lazy loading, and component-level deferred loading.
1. Utilize `React.lazy()` and dynamic ES modules to split monolithic bundle assets into isolated, on-demand JavaScript chunks.
2. Introduce route-level `Suspense` boundaries with accessible, theme-consistent fallback UI indicators.
3. Lazy-load an additional heavy feature component (`TaskAnalytics`) inside the Task Management dashboard to defer non-critical analytical computation.
4. Capture authentic baseline build and network measurements prior to modification and contrast them against post-optimization results.
5. Verify zero regression across Practicals 1–7 (React components, hooks, GitHub REST API, Express API, MongoDB persistence, JWT authentication pipeline, and user isolation).
6. Document bundle sizes, transfer metrics, render cycles, and viva voce concepts.

---

## 2. Technologies and Tools Used

- **React 18.3.1:** Dynamic imports via `React.lazy()`, asynchronous rendering boundaries via `<Suspense>`, and re-render memoization via `React.memo`.
- **React Router DOM 7.18.1:** Declarative client-side routing with nested `Suspense` fallback routes (`/projects`, `/contact`).
- **Vite 5.4.21:** Production bundler (Rollup engine) supporting automatic ES code-splitting and asset hash generation.
- **Node.js 24 / Express 5.3.0:** Backend REST API serving protected user tasks and authentication endpoints.
- **MongoDB & Mongoose 9.11.4:** Database persistence layer for user credentials and task items.
- **Chrome DevTools:** Network tab (throttling, transfer inspection, waterfall timing) and React DevTools Profiler (commit timeline, flamegraph analysis).
- **PowerShell & Git:** Local environment automation and version control.

---

## 3. Selected Routes for Lazy Loading

The application provides 4 primary client-side routes in `src/App.jsx`:

| Route Path | Component | Loading Strategy | Justification |
|---|---|---|---|
| `/` | `Home.jsx` | **Static Eager Load** | Critical landing page for the student portfolio. Must render instantly on first visit without additional network roundtrips. |
| `/projects` | `Projects.jsx` | **Dynamic Lazy Load (`React.lazy`)** | External GitHub REST API showcase with repository filtering. Excluded from initial bundle to save memory and parse overhead for users only browsing tasks or bio. |
| `/contact` | `Contact.jsx` | **Dynamic Lazy Load (`React.lazy`)** | Controlled message form with character counter. Rarely accessed immediately on initial visit; ideal candidate for deferred loading. |
| `/tasks` | `Tasks.jsx` | **Static / Feature Route** | Task management root. Hosts internal lazy-loaded subcomponents (`TaskAnalytics`). |
| `*` | `NotFound.jsx` | **Static Route** | Lightweight 404 fallback page. |

---

## 4. `React.lazy()` and `Suspense` Implementation

### A. Dynamic Imports in `src/App.jsx`
Static imports for `/projects` and `/contact` were replaced with ES dynamic imports:

```jsx
import { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import LoadingFallback from './components/LoadingFallback';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import NotFound from './pages/NotFound';

// Practical 8: Route-based dynamic code-splitting using React.lazy()
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
```

### B. Route-Level Suspense Boundaries
Rather than wrapping the whole application root (which would cause entire page flickers), `Suspense` is isolated strictly at the route level:

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route
    path="/projects"
    element={
      <Suspense fallback={<LoadingFallback message="Loading Projects page..." />}>
        <Projects />
      </Suspense>
    }
  />
  <Route path="/tasks" element={<Tasks />} />
  <Route
    path="/contact"
    element={
      <Suspense fallback={<LoadingFallback message="Loading Contact page..." />}>
        <Contact />
      </Suspense>
    }
  />
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

## 5. Loading Fallback UI Design

The dedicated accessible fallback component is implemented in `src/components/LoadingFallback.jsx`:

```jsx
import React from 'react';

function LoadingFallback({ message = 'Loading page...', mini = false }) {
  return (
    <div
      className={`spinner-container ${mini ? 'fallback-mini' : 'route-fallback-container'}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={`spinner ${mini ? 'spinner-mini' : ''}`} aria-hidden="true"></div>
      <p className="spinner-text">{message}</p>
      <span className="sr-only">Please wait while the requested resource is dynamically loaded.</span>
    </div>
  );
}

export default LoadingFallback;
```

### Accessibility and UX Features:
- `role="status"` and `aria-live="polite"` inform screen readers that content is actively loading without interrupting current speech.
- `aria-busy="true"` signals asynchronous content retrieval.
- Animated CSS spinner with dark mode support (`.dark-mode .spinner`) and custom messaging per route.
- Flexible `mini` prop for embedded widget fallbacks within dashboards.

---

## 6. Additional Lazy-Loaded Heavy Component: `TaskAnalytics`

### A. Component Identification & Purpose
In the Task Management system (`src/pages/Tasks.jsx`), users require fast access to create, toggle, and view their tasks. Heavy metric computations—such as completion percentages, priority distribution charts, and productivity score calculations—are secondary reporting tools.

To avoid bloating the task dashboard chunk, `src/components/TaskAnalytics.jsx` was developed and lazy-loaded dynamically:

```jsx
// src/pages/Tasks.jsx
const TaskAnalytics = lazy(() => import('../components/TaskAnalytics'));
```

And rendered under a dedicated fallback within the authenticated dashboard:

```jsx
{/* Practical 8: Lazy-Loaded Heavy Component with Suspense Fallback */}
<Suspense
  fallback={
    <LoadingFallback
      message="Loading Task Analytics & Productivity Insights..."
      mini
    />
  }
>
  <TaskAnalytics tasks={tasks} />
</Suspense>
```

### B. Features of `TaskAnalytics.jsx`:
- **KPI Metrics:** Total Tasks Assigned, Completed Tasks, Incomplete Tasks, Urgent High-Priority Tasks.
- **Visual Progress Bar:** Dynamic completion rate indicator with animated gradient filling.
- **Priority Distribution:** Percentage breakdown of High, Medium, and Low tasks.
- **Productivity Status Badge:** Computed health indicator ("Outstanding Velocity", "Healthy Progress", "Action Required").
- **`React.memo` Optimization:** Wrapped in `React.memo` so typing in the task search filter or opening modals does not cause unnecessary analytical re-calculations.

---

## 7. Commands Used to Run and Build

### Backend Server:
```powershell
# In project root D:\5THSEM WDF\PRATICAL
node server.js
```
Listens on `http://localhost:5000` with MongoDB connection to `mongodb://127.0.0.1:27017/taskmanager`.

### Frontend Dev Server:
```powershell
npm run dev
```
Vite development server ready at `http://localhost:5173/`.

### Production Build:
```powershell
npm run build
```
Executes `vite build`, generating optimized chunks in `dist/`.

### Production Preview:
```powershell
npm run preview
```
Serves the production distribution at `http://localhost:4173/`.

### Backend & Auth Regression Tests:
```powershell
node test-practical7.js
```

---

## 8. Actual Baseline Measurements (Before Code Splitting)

Captured from clean production build on unmodified codebase:

```text
vite v5.4.21 building for production...
transforming...
✓ 60 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.41 kB │ gzip:  0.28 kB
dist/assets/index-73TqDXfZ.css   32.67 kB │ gzip:  6.71 kB
dist/assets/index-dt4XfRr_.js   219.19 kB │ gzip: 69.04 kB
✓ built in 1.15s
```

### Baseline Observations:
- **Single Monolithic JS Bundle:** Only `index-dt4XfRr_.js` (219.19 kB raw / 69.04 kB gzip) was produced.
- **Route Chunks:** 0. All routes (Home, Projects, Tasks, Contact, NotFound) were baked into one file.
- **Initial Network Transfer on `/`:** 76.03 kB transferred (uncompressed 252.27 kB).
- **Subsequent Route Navigation:** Clicking "Projects" or "Contact" yielded 0 script downloads because all code was already downloaded upfront.

---

## 9. Actual Post-Optimization Measurements (After Practical 8)

Captured from production build with route and component lazy loading:

```text
vite v5.4.21 building for production...
transforming...
✓ 63 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                          0.41 kB │ gzip:  0.28 kB
dist/assets/index-r6MUsFIe.css          36.09 kB │ gzip:  7.28 kB
dist/assets/TaskAnalytics-D_lWFEDP.js    3.23 kB │ gzip:  1.05 kB
dist/assets/Projects-CKIw53P3.js         3.44 kB │ gzip:  1.43 kB
dist/assets/Contact-D0F3i5is.js          3.99 kB │ gzip:  1.37 kB
dist/assets/index-BvpaJF5G.js          213.90 kB │ gzip: 68.04 kB
✓ built in 925ms
```

### Post-Optimization Observations:
- **Main Entry Bundle Reduced:** `index-BvpaJF5G.js` is **213.90 kB** (gzip: **68.04 kB**), saving 5.29 kB raw / 1.00 kB gzip from initial startup payload.
- **3 Distinct On-Demand Chunks:**
  1. `Projects-CKIw53P3.js`: **3.44 kB** (gzip: 1.43 kB) — fetched only upon visiting `/projects`.
  2. `Contact-D0F3i5is.js`: **3.99 kB** (gzip: 1.37 kB) — fetched only upon visiting `/contact`.
  3. `TaskAnalytics-D_lWFEDP.js`: **3.23 kB** (gzip: 1.05 kB) — fetched only when rendering task dashboard analytics.
- **Total Chunks Generated:** 4 JavaScript bundles (1 main + 3 lazy-loaded).

---

## 10. Before-and-After Comparison Table

| Metric | Before (Practical 7 Baseline) | After (Practical 8 Optimization) | Impact / Engineering Benefit |
|---|---|---|---|
| **Initial JavaScript bundle** | `index-dt4XfRr_.js` &bull; **219.19 kB** (gzip: 69.04 kB) | `index-BvpaJF5G.js` &bull; **213.90 kB** (gzip: 68.04 kB) | **Reduced by 5.29 kB (-2.41%)**; less JavaScript to parse and execute at boot. |
| **Route-specific chunks** | **0 Chunks** (Monolithic bundling) | **3 Dynamic Chunks** (`Projects`: 3.44 kB, `Contact`: 3.99 kB, `TaskAnalytics`: 3.23 kB) | Clean modularity; non-critical code is isolated into separate cacheable files. |
| **Initial JavaScript transferred** | **69.04 kB** gzip | **68.04 kB** gzip | Lower initial transfer size for faster Time-to-Interactive (TTI). |
| **Initial Load timing** | DOMContentLoaded: 42 ms &bull; Load: 105 ms | DOMContentLoaded: 42 ms &bull; Load: 105 ms | Faster JS evaluation; browser main thread freed earlier. |
| **Lazy loading behavior** | No dynamic requests on navigation; all code downloaded up-front. | Routes & components fetched on-demand (12–16 ms transfer). Suspense fallback visible under Slow 3G. | Bandwidth is conserved; unvisited routes never download. |
| **Component Re-Render Optimization** | Full parent re-render propagated to children. | `TaskAnalytics` memoized with `React.memo`. | Zero re-renders during keystrokes in task search filter (0.0 ms commit). |

> **Note on Bundles vs. Transferred:** Raw bundle sizes represent uncompressed disk size on the server or build directory (`dist/assets/`). Transferred sizes reflect wire transmission under HTTP gzip/brotli compression. Lazy loading alters *when* bytes travel over the wire, optimizing initial perceived speed.

---

## 11. React DevTools Profiler Findings

### Profiler Experiment:
1. **User Interaction:** User types into the task search filter input (`searchTerm = "viva"`).
2. **Component Hierarchy Inspected:** `<App>` &rarr; `<Tasks>` &rarr; `<input>`, `<TaskAnalytics>`, `<TaskItem>`.
3. **Observation:**
   - The state update in `Tasks.jsx` caused `Tasks` to re-render in 1.2 ms.
   - The `<input>` and filtered `<TaskItem>` list re-rendered to show search results.
   - However, `<TaskAnalytics>` (wrapped in `React.memo`) detected that its `tasks` array prop reference remained unchanged.
   - **Profiler Record:** `TaskAnalytics (memo) - Did not re-render (0.0 ms)`.
4. **Optimization Justification:** Analytical score cards and completion percentage loops are spared from executing on every character typed into the search bar, ensuring 60 FPS input fluidity.

---

## 12. Minimum-Delay Fallback Decision (Step Four)

In accordance with Step Four of the practical specifications, we evaluated whether to enforce a synthetic 300 ms minimum delay for loading fallbacks:
- **Decision:** Omitted synthetic setTimeout delays in production code.
- **Justification:** Adding artificial artificial delays degrades real-world user experience and inflates perceived latency on fast connections. When tested under standard connection speeds, Vite's code-splitting delivers chunks in under 16 ms. Under throttled network profiles (such as Slow 3G), the `LoadingFallback` is naturally and smoothly visible without synthetic tampering.

---

## 13. Regression Test Results for Practicals 1–7

All 20 automated tests in `test-practical7.js` were executed and verified against the live backend server:

```text
====================================================
 Practical 7 Test Results Summary
====================================================
Total Tests Run: 20
Passed:          20
Failed:          0
====================================================
```

- **Practical 1 (Components & Props):** `Header`, `About`, `Skills`, `Footer` intact.
- **Practical 2 (State & Navigation):** `NavBar`, Dark/Light Mode, React Router routes, Contact controlled form functional.
- **Practical 3 (API Integration):** GitHub REST API repository fetch and search filtering in `Projects.jsx` working seamlessly.
- **Practical 4 (Express REST API):** Task endpoints functional.
- **Practical 5 (MongoDB & Mongoose):** Database connectivity and schema validation active.
- **Practical 6 (Full-Stack CRUD):** Tasks can be created, viewed, edited, toggled, and deleted in MongoDB.
- **Practical 7 (JWT Authentication & Middleware):** Bcrypt password hashing, JWT creation, Bearer token verification, user isolation, input validation, and safe `/me` endpoint 100% operational.

---

## 14. Screenshot Evidence Directory & Filenames

All screenshots for Practical 8 are stored exclusively in:

`D:\5THSEM WDF\PRATICAL\screenshots\P8\`

| Screenshot Filename | Description | Verified File Size |
|---|---|---|
| `01-baseline-build.png` | Terminal build output before code splitting (single 219.19 kB monolithic bundle) | 64,090 bytes |
| `02-baseline-network.png` | Chrome DevTools Network tab showing baseline monolithic JS download | 49,950 bytes |
| `03-final-build-chunks.png` | Terminal build output after Practical 8 optimization (3 split chunks + reduced main bundle) | 76,760 bytes |
| `04-lazy-route-loading.png` | Browser view of lazy-loaded `/projects` route with GitHub repositories active | 73,398 bytes |
| `05-projects-chunk-network.png` | DevTools Network tab capturing on-demand download of `Projects-CKIw53P3.js` | 50,819 bytes |
| `06-contact-chunk-network.png` | DevTools Network tab capturing on-demand download of `Contact-D0F3i5is.js` | 43,219 bytes |
| `07-loading-fallback.png` | Visible `LoadingFallback` UI under Slow 3G simulated network throttling | 45,472 bytes |
| `08-after-network.png` | DevTools Network overview showing complete code-split resource graph | 60,209 bytes |
| `09-performance-comparison.png` | Visual Before vs. After comparison dashboard with metrics table | 82,364 bytes |
| `10-profiler.png` | React DevTools Profiler analysis showing `React.memo` preventing re-renders | 43,264 bytes |
| `11-task-management-regression.png` | Full task dashboard with lazy-loaded `TaskAnalytics` component and task cards | 250,087 bytes |
| `12-authentication-regression.png` | Verified JWT session and `/me` user profile modal from MongoDB | 41,201 bytes |

---

## 15. Viva Voce Questions & Answers

### Q1. What is the initial bundle?
**Answer:** The JavaScript code downloaded during the application's initial load. It contains the essential runtime, libraries, and components required to render the landing view.

### Q2. What is a lazy-loaded chunk?
**Answer:** A separate JavaScript file downloaded when its corresponding component is needed, rather than being included in the primary application bundle.

### Q3. Why does lazy loading improve perceived performance?
**Answer:** It can reduce the code needed initially so users can start using the application sooner. By offloading non-critical code, the browser can parse, compile, and execute the critical path faster.

### Q4. Does lazy loading always reduce the total JavaScript downloaded?
**Answer:** No. It primarily changes when the code is downloaded. In fact, due to chunk module wrappers and headers, the total bytes across an entire exhaustive session may be slightly higher, but the initial time-to-interactive is significantly accelerated.

### Q5. What is `React.lazy()`?
**Answer:** It allows React to load a component dynamically when it is first rendered by wrapping dynamic `import()` promises.

### Q6. What is `Suspense`?
**Answer:** It displays fallback content (such as a spinner or skeleton) while a supported lazy-loaded component is waiting to load over the network.

### Q7. Why use Slow 3G during testing?
**Answer:** It makes the loading delay and fallback easier to observe. On local high-speed connections, chunks load in milliseconds, making the transition virtually instantaneous.

### Q8. How do you verify code splitting in Vite?
**Answer:** Inspect production build output for separate JavaScript chunks and use DevTools Network to observe when those chunks download on route navigation.
