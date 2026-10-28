import React from 'react';

/**
 * Task Item Card Component for Practical 6
 * Renders individual task card with status toggle, priority badge, edit, and delete triggers.
 */
function TaskItem({ task, onToggleComplete, onEdit, onDelete, isUpdating }) {
  const priorityColors = {
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low'
  };

  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  return (
    <div className={`task-card ${task.completed ? 'task-completed' : ''}`}>
      <div className="task-card-main">
        <label className="task-check-wrap" title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}>
          <input
            type="checkbox"
            className="task-checkbox"
            checked={Boolean(task.completed)}
            onChange={() => onToggleComplete(task)}
            disabled={isUpdating}
          />
          <span className="custom-check" />
        </label>

        <div className="task-details">
          <div className="task-header-row">
            <h4 className="task-title-text">{task.title}</h4>
            <div className="task-badges">
              <span className={`priority-badge ${priorityColors[task.priority] || 'badge-medium'}`}>
                {task.priority || 'medium'}
              </span>
              <span className={`status-badge ${task.completed ? 'status-done' : 'status-pending'}`}>
                {task.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>

          {task.description && (
            <p className="task-desc-text">{task.description}</p>
          )}

          <div className="task-meta-row">
            {formattedDate && (
              <span className="task-date-text">📅 Created on {formattedDate}</span>
            )}
            <span className="task-id-text">ID: {task._id?.slice(-6)}</span>
          </div>
        </div>
      </div>

      <div className="task-actions-row">
        <button
          type="button"
          className="btn-icon btn-edit"
          onClick={() => onEdit(task)}
          disabled={isUpdating}
          title="Edit Task"
        >
          ✏️ Edit
        </button>
        <button
          type="button"
          className="btn-icon btn-delete"
          onClick={() => onDelete(task)}
          disabled={isUpdating}
          title="Delete Task"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
