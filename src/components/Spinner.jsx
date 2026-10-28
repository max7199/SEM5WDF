// =============================================================================
// Practical 3: API Integration and Data Rendering in React
// File: src/components/Spinner.jsx
// Description: Accessible CSS loading spinner displayed while API request is in progress
// =============================================================================

function Spinner() {
  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <p className="spinner-text">Loading repositories...</p>
    </div>
  );
}

export default Spinner;
