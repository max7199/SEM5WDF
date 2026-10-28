// =============================================================================
// Practical 2: React State Management and Multi-Page Navigation
// File: src/App.jsx
// Description: Main root application component configuring React Router routes
//              (/, /projects, /contact, *) and managing dark/light mode state.
// =============================================================================

import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Tasks from './pages/Tasks';
import NotFound from './pages/NotFound';
import './App.css';

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

      {/* 2. Client-Side Multi-Page Routes */}
      <div className="content-area">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/contact" element={<Contact />} />
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
