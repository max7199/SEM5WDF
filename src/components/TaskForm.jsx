import React, { useState, useEffect } from 'react';

/**
 * Task Form Component for Practical 6
 * Supports both creating new tasks and editing existing tasks.
 */
function TaskForm({ onSubmit, editingTask, onCancelEdit, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [completed, setCompleted] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Sync form fields when editingTask changes
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority || 'medium');
      setCompleted(Boolean(editingTask.completed));
      setValidationError('');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCompleted(false);
      setValidationError('');
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || title.trim() === '') {
      setValidationError('Task title is required.');
      return;
    }

    setValidationError('');

    const payload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      completed
    };

    const success = await onSubmit(payload);
    // Clear form only on confirmed success when creating
    if (success && !editingTask) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCompleted(false);
    }
  };

  return (
    <div className="task-form-card">
      <div className="task-form-header">
        <h3 className="task-form-title">
          {editingTask ? '✏️ Edit Task' : '➕ Create New Task'}
        </h3>
        {editingTask && (
          <span className="editing-badge">Editing Task #{editingTask._id?.slice(-6)}</span>
        )}
      </div>

      {validationError && (
        <div className="form-error-alert" role="alert">
          ⚠️ {validationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="task-form" noValidate>
        <div className="form-group">
          <label htmlFor="task-title" className="form-label">
            Title <span className="required-star">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            className="form-input"
            placeholder="e.g. Complete Practical 6 Integration"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-description" className="form-label">
            Description
          </label>
          <textarea
            id="task-description"
            className="form-textarea"
            rows="3"
            placeholder="Optional task details or instructions..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-row">
          <div className="form-group form-col">
            <label htmlFor="task-priority" className="form-label">
              Priority
            </label>
            <select
              id="task-priority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          {editingTask && (
            <div className="form-group form-col">
              <label className="form-label">Completion Status</label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  disabled={isSubmitting}
                />
                <span>Mark as Completed</span>
              </label>
            </div>
          )}
        </div>

        <div className="form-actions">
          {editingTask && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="btn-loading-content">
                <span className="mini-spinner" /> Saving...
              </span>
            ) : editingTask ? (
              'Save Changes'
            ) : (
              'Create Task'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
