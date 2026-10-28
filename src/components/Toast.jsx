import React from 'react';

/**
 * Toast Notification Component for Practical 6
 * Displays success, error, and info banners with auto-dismiss.
 */
function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type || 'info'}`}
          role="alert"
        >
          <div className="toast-icon">
            {toast.type === 'success' && '✅'}
            {toast.type === 'error' && '❌'}
            {toast.type === 'info' && 'ℹ️'}
          </div>
          <div className="toast-message">
            <span className="toast-text">{toast.message}</span>
            {toast.details && Array.isArray(toast.details) && (
              <ul className="toast-details-list">
                {toast.details.map((d, i) => (
                  <li key={i}>{d.message || d}</li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => onDismiss(toast.id)}
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

export default Toast;
