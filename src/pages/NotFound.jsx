// =============================================================================
// Practical 2: React State Management and Multi-Page Navigation
// File: src/pages/NotFound.jsx
// Description: Custom 404 page displayed for any unmatched route using React Router
// =============================================================================

import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="page-container notfound-page">
      <div className="notfound-card">
        <div className="notfound-icon" aria-hidden="true">🔍</div>
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-text">
          Oops! The route you are trying to visit does not exist in this student portfolio.
        </p>
        <Link to="/" className="btn-return-home">
          &larr; Return to Home Page
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
