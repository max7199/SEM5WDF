import React from 'react';

/**
 * Confirmation Modal Dialog for Practical 6
 * Prevents accidental deletions with Cancel and Confirm actions.
 */
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', isDeleting = false }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-warn-icon">⚠️</span>
            <h3 className="modal-title">{title || 'Confirm Action'}</h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onCancel}
            aria-label="Close dialog"
            disabled={isDeleting}
          >
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-message">{message || 'Are you sure you want to proceed?'}</p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
