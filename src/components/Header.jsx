// =============================================================================
// Practical 2: React State Management and Multi-Page Navigation
// File: src/components/Header.jsx
// Description: Reusable Header banner displaying student name, portfolio title,
//              academic meta tags, and inline style themeColor.
// =============================================================================

function Header({
  name = 'Max Patel',
  title = 'B.Tech Information Technology Student',
  themeColor = '#1e3a8a',
  showNav = false,
  onThemeChange
}) {
  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' }
  ];

  return (
    <header className="header" style={{ backgroundColor: themeColor }}>
      {showNav && (
        <nav className="header-nav" aria-label="Portfolio Sections Navigation">
          <div className="header-nav-container">
            <a href="#about" className="header-brand">
              <span className="brand-icon" aria-hidden="true">💻</span>
              <span className="brand-name">{name}</span>
            </a>

            <ul className="nav-menu">
              {navLinks.map((link) => (
                <li key={link.href} className="nav-menu-item">
                  <a href={link.href} className="nav-menu-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      {/* Hero / Portfolio Title Section */}
      <div className="header-hero">
        <div className="header-container">
          <div className="header-badge">React Portfolio &bull; 24IT070</div>
          <h1 className="header-title">{name}&apos;s Portfolio</h1>
          <p className="header-subtitle">{title}</p>
          <div className="header-meta">
            <span>📍 Gujarat, India</span>
            <span>🎓 Charusat University</span>
            <span>🆔 Roll No: 24IT070</span>
            <span>⚡ Semester 5</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
