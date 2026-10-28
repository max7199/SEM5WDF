// =============================================================================
// Practical 3: API Integration and Data Rendering in React
// File: src/components/ErrorMessage.jsx
// Description: Component to render clear error messages with a Retry button
// =============================================================================

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container" role="alert">
      <div className="error-content">
        <span className="error-icon" aria-hidden="true">⚠️</span>
        <div className="error-text-wrap">
          <h3 className="error-heading">Failed to Load Repositories</h3>
          <p className="error-message">
            {message || 'Unable to connect to GitHub REST API. Please check your network and try again.'}
          </p>
        </div>
      </div>
      {onRetry && (
        <button
          type="button"
          className="retry-btn"
          onClick={onRetry}
          aria-label="Retry fetching repositories"
        >
          🔄 Retry Request
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
