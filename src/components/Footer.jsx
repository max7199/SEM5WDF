// =============================================================================
// Practical 1: Introduction to React and Component Architecture
// File: src/components/Footer.jsx
// Description: Footer component displaying contact information, academic details,
//              and copyright message, receiving student information via props.
// =============================================================================

function Footer({
  name = 'Max Patel',
  email = '24it070@charusat.edu.in',
  year = new Date().getFullYear(),
  rollNo = '24IT070'
}) {
  return (
    <footer id="contact" className="footer" aria-labelledby="footer-contact-heading">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 id="footer-contact-heading" className="footer-heading">Contact Information</h3>
            <p className="footer-text">
              <strong>Student:</strong> {name} ({rollNo})
            </p>
            <p className="footer-text">
              <strong>Email:</strong>{' '}
              <a href={`mailto:${email}`} className="footer-email-link">
                {email}
              </a>
            </p>
            <p className="footer-text">
              <strong>Location:</strong> Gujarat, India
            </p>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Academic Information</h3>
            <p className="footer-text">B.Tech in Information Technology</p>
            <p className="footer-text">Charusat University</p>
            <p className="footer-text">Web Development Frameworks (Practical 1)</p>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Portfolio Details</h3>
            <p className="footer-text">
              Repository:{' '}
              <a
                href="https://github.com/max7199/task5-todoapp-maxpatel.git"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-email-link"
              >
                <code>task5-todoapp-maxpatel</code> ↗
              </a>
            </p>
            <p className="footer-text">Course Outcome: CO1</p>
            <p className="footer-text">Program Outcomes: PO3, PO5</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright-text">
            &copy; {year} {name} (Roll No: {rollNo}). All rights reserved.
          </p>
          <p className="tech-badge">Built with React 18 &bull; Vite &bull; Component Architecture</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
