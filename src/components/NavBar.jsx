// =============================================================================
// Practical 2: React State Management and Multi-Page Navigation
// File: src/components/NavBar.jsx
// Description: Reusable navigation bar using NavLink from react-router-dom
//              with active route highlighting and a dark/light mode toggle.
// =============================================================================

import { NavLink } from 'react-router-dom';

function NavBar({ darkMode, onToggleDarkMode }) {
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Projects' },
    { to: '/tasks', label: 'Tasks' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="nav-container">
        <NavLink to="/" className="nav-brand">
          <span className="brand-icon">💻</span>
          <span className="brand-title">Max Patel &bull; Portfolio</span>
        </NavLink>

        <div className="nav-menu-wrapper">
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                  end={item.to === '/'}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Dark / Light Mode Toggle using useState in App.jsx */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark/Light Mode"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
