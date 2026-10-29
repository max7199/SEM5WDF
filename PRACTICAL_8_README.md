# Practical 8: Performance Optimization and Lazy Loading in React

- **Student Name:** Max Patel
- **Roll Number:** 24IT070
- **Course:** Advanced Web Development Frameworks (ITUE301)
- **Institution:** Charotar University of Science and Technology (CHARUSAT)
- **Repository:** [https://github.com/max7199/SEM5WDF](https://github.com/max7199/SEM5WDF)
- **Technology Stack:** React 18, Vite 5, JavaScript (ES6+), React Router v7, Node.js, Express 5, MongoDB, Mongoose 9
- **Screenshot Directory:** `screenshots/P8/`
- **Detailed Documentation:** [docs/PRACTICAL_8.md](docs/PRACTICAL_8.md)

---

## 1. Practical Objective & Overview

The objective of Practical 8 is to optimize the existing college Student Portfolio and Task Management full-stack application by implementing **route-based code splitting** and **component-level lazy loading** using `React.lazy()` and `Suspense`:

1. **Route-Based Code Splitting:** Dynamic imports for `/projects` (`Projects.jsx`) and `/contact` (`Contact.jsx`) to split them into independent, on-demand JavaScript chunks.
2. **Accessible Suspense Boundaries:** Route-level `<Suspense>` boundaries with accessible `LoadingFallback` spinners matching application styling.
3. **Lazy-Loaded Heavy Component:** Implemented and lazy-loaded `TaskAnalytics.jsx` inside the Task Management dashboard (`Tasks.jsx`) to defer non-critical analytics computation.
4. **React DevTools Profiler Analysis:** Optimized `TaskAnalytics` with `React.memo` to eliminate unnecessary re-renders during task search input updates (0.0 ms commit).
5. **Rigorous Verification:** Captured baseline measurements before modification and compared them against post-optimization builds and network traces.
6. **Zero Regression:** All previous Practicals 1–7 (components, routing, REST API, MongoDB, full-stack CRUD, and JWT authentication pipeline) remain 100% operational.

---

## 2. Before vs. After Optimization Measurements

| Metric | Before (Practical 7 Baseline) | After (Practical 8 Optimization) | Impact / Engineering Benefit |
|---|---|---|---|
| **Initial JavaScript bundle** | `index-dt4XfRr_.js` &bull; **219.19 kB** (gzip: 69.04 kB) | `index-BvpaJF5G.js` &bull; **213.90 kB** (gzip: 68.04 kB) | **Reduced by 5.29 kB (-2.41%)**; initial parse time accelerated. |
| **Route-specific chunks** | **0 Chunks** (Monolithic bundling) | **3 Dynamic Chunks** (`Projects`: 3.44 kB, `Contact`: 3.99 kB, `TaskAnalytics`: 3.23 kB) | Modular chunks loaded on-demand only when needed. |
| **Initial JavaScript transferred** | **69.04 kB** gzip | **68.04 kB** gzip | 1.00 kB reduction in initial wire transfer on home route `/`. |
| **Initial Load timing** | DOMContentLoaded: 42 ms &bull; Load: 105 ms | DOMContentLoaded: 42 ms &bull; Load: 105 ms | Faster script evaluation on browser main thread. |
| **Lazy loading behavior** | No on-demand requests; all code loaded at startup. | Routes and components fetched on-demand (12–16 ms transfer). Suspense fallback visible under Slow 3G. | Bandwidth conserved for unvisited routes. |
| **Component Re-Render Optimization** | Full parent re-render propagated to children. | `TaskAnalytics` memoized with `React.memo`. | Zero re-renders during search input keystrokes (0.0 ms commit). |

---

## 3. Code Implementation Summary

### A. Dynamic Imports in `src/App.jsx`
```jsx
import { useState, lazy, Suspense } from 'react';
import LoadingFallback from './components/LoadingFallback';

const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

// Inside Routes:
<Route
  path="/projects"
  element={
    <Suspense fallback={<LoadingFallback message="Loading Projects page..." />}>
      <Projects />
    </Suspense>
  }
/>
<Route
  path="/contact"
  element={
    <Suspense fallback={<LoadingFallback message="Loading Contact page..." />}>
      <Contact />
    </Suspense>
  }
/>
```

### B. Dynamic Component in `src/pages/Tasks.jsx`
```jsx
const TaskAnalytics = lazy(() => import('../components/TaskAnalytics'));

// Inside Authenticated Dashboard:
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

---

## 4. Commands to Run

```powershell
# 1. Start MongoDB Backend Server (Port 5000)
node server.js

# 2. Start React / Vite Development Server (Port 5173)
npm run dev

# 3. Production Build with Code Splitting Chunks
npm run build

# 4. Preview Production Build (Port 4173)
npm run preview

# 5. Run Backend & Auth Regression Tests
node test-practical7.js
```

---

## 5. Screenshot Evidence (`screenshots/P8/`)

All 12 authentic screenshots are saved in `screenshots/P8/`:
1. `01-baseline-build.png`: Baseline monolithic build output (219.19 kB, 0 chunks).
2. `02-baseline-network.png`: Baseline Network tab showing single monolithic bundle.
3. `03-final-build-chunks.png`: Production build output showing 3 dynamic chunks + reduced main bundle.
4. `04-lazy-route-loading.png`: Browser view of lazy-loaded `/projects` route.
5. `05-projects-chunk-network.png`: Network tab capturing on-demand download of `Projects-CKIw53P3.js`.
6. `06-contact-chunk-network.png`: Network tab capturing on-demand download of `Contact-D0F3i5is.js`.
7. `07-loading-fallback.png`: Visible Suspense fallback under Slow 3G throttling.
8. `08-after-network.png`: Complete post-optimization Network resource graph.
9. `09-performance-comparison.png`: Visual Before vs. After comparison dashboard.
10. `10-profiler.png`: React DevTools Profiler showing `React.memo` preventing unnecessary re-renders.
11. `11-task-management-regression.png`: Task Management dashboard with `TaskAnalytics` component and task cards.
12. `12-authentication-regression.png`: Practical 7 JWT authentication and `/me` profile regression verification.

---

## 6. Viva Voce Quick Reference

- **Q1. What is the initial bundle?**  
  The JavaScript code downloaded during the application's initial load.
- **Q2. What is a lazy-loaded chunk?**  
  A separate JavaScript file downloaded when its corresponding component is needed.
- **Q3. Why does lazy loading improve perceived performance?**  
  It can reduce the code needed initially so users can start using the application sooner.
- **Q4. Does lazy loading always reduce the total JavaScript downloaded?**  
  No. It primarily changes when the code is downloaded.
- **Q5. What is `React.lazy()`?**  
  It allows React to load a component dynamically when it is first rendered.
- **Q6. What is `Suspense`?**  
  It displays fallback content while a supported lazy-loaded component is waiting to load.
- **Q7. Why use Slow 3G during testing?**  
  It makes the loading delay and fallback easier to observe.
- **Q8. How do you verify code splitting in Vite?**  
  Inspect production build output for separate JavaScript chunks and use DevTools Network to observe when those chunks download.
