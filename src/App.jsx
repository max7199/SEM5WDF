// =============================================================================
// Practical 8: Performance Optimization and Lazy Loading in React
// File: src/App.jsx
// Description: Main root application component configuring React Router routes
//              with React.lazy() and Suspense for code-splitting and lazy-loading
//              route components (Projects, Contact), managing dark/light mode state.
// =============================================================================

import { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import LoadingFallback from './components/LoadingFallback';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import NotFound from './pages/NotFound';
import './App.css';

// Practical 8: Route-based dynamic code-splitting using React.lazy()
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  // Supplementary Requirement: Dark / Light Mode state
  const [darkMode, setDarkMode] = useState(false);

  // Student details passed to Footer
  const student = {
    name: 'Max Patel',
    rollNo: '24IT070',
    email: '24it070@charusat.edu.in'
  };

  return (
    <div className={`portfolio-app ${darkMode ? 'dark-mode' : ''}`}>
      {/* 1. Global Navigation Bar on every route */}
      <NavBar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* 2. Client-Side Multi-Page Routes with Route-Level Suspense */}
      <div className="content-area">
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
      </div>

      {/* 3. Global Footer on every page */}
      <Footer
        name={student.name}
        rollNo={student.rollNo}
        email={student.email}
        year={new Date().getFullYear()}
      />
    </div>
  );
}

export default App;
