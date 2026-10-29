// =============================================================================
// Practical 8: Performance Optimization and Lazy Loading in React
// File: src/components/LoadingFallback.jsx
// Description: Accessible, reusable loading fallback component displayed during
//              React.lazy dynamic component fetching under Suspense boundaries.
// =============================================================================

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
