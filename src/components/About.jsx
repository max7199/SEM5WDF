// =============================================================================
// Practical 1: Introduction to React and Component Architecture
// File: src/components/About.jsx
// Description: About component displaying student bio and key academic details,
//              accepting student information via props with semantic HTML.
// =============================================================================

function About({
  name = 'Max Patel',
  bio,
  rollNo = '24IT070',
  degree = 'B.Tech Information Technology',
  university = 'Charusat University',
  email = '24it070@charusat.edu.in'
}) {
  const defaultBio = `Hello! I am ${name}, a 3rd-year B.Tech Information Technology student at ${university} (Roll No: ${rollNo}). I am passionate about learning modern web development frameworks, mastering React component architecture, and engineering robust, user-friendly digital applications.`;

  return (
    <section id="about" className="section about-section" aria-labelledby="about-heading">
      <div className="section-title-wrap">
        <h2 id="about-heading" className="section-title">About Me</h2>
        <div className="title-underline"></div>
      </div>

      <p className="about-bio">
        {bio || defaultBio}
      </p>

      <div className="info-grid">
        <div className="info-card">
          <span className="info-icon" aria-hidden="true">👤</span>
          <div>
            <span className="info-label">Full Name</span>
            <p className="info-value">{name}</p>
          </div>
        </div>

        <div className="info-card">
          <span className="info-icon" aria-hidden="true">🆔</span>
          <div>
            <span className="info-label">Roll Number</span>
            <p className="info-value">{rollNo}</p>
          </div>
        </div>

        <div className="info-card">
          <span className="info-icon" aria-hidden="true">🎓</span>
          <div>
            <span className="info-label">Degree</span>
            <p className="info-value">{degree}</p>
          </div>
        </div>

        <div className="info-card">
          <span className="info-icon" aria-hidden="true">🏛️</span>
          <div>
            <span className="info-label">Institution</span>
            <p className="info-value">{university}</p>
          </div>
        </div>

        <div className="info-card">
          <span className="info-icon" aria-hidden="true">✉️</span>
          <div>
            <span className="info-label">College Email</span>
            <p className="info-value">{email}</p>
          </div>
        </div>

        <div className="info-card">
          <span className="info-icon" aria-hidden="true">🎯</span>
          <div>
            <span className="info-label">Focus Areas</span>
            <p className="info-value">React, Web Frameworks, REST APIs</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
