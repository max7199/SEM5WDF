import React, { useState, useEffect } from 'react';
import { generateAiDescription } from '../api.js';

/**
 * Task Form Component for Practical 6 & Practical 13
 * Supports both creating new tasks and editing existing tasks.
 * Includes Practical 13: Secure AI Task Description Generation with
 * loading states, in-memory rate limiting, editable suggestions, and graceful fallback.
 */
function TaskForm({ onSubmit, editingTask, onCancelEdit, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [completed, setCompleted] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Practical 13 AI Generation States
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSuccess, setAiSuccess] = useState(false);
  // Stable client identifier for new tasks (unpersisted in DB) for rate limiting
  const [clientId] = useState(() => 'client_task_' + Math.random().toString(36).substring(2, 10));

  // Sync form fields when editingTask changes
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority || 'medium');
      setCompleted(Boolean(editingTask.completed));
      setValidationError('');
      setAiError('');
      setAiSuccess(false);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCompleted(false);
      setValidationError('');
      setAiError('');
      setAiSuccess(false);
    }
  }, [editingTask]);

  /**
   * Practical 13: Handle AI Task Description Generation
   * Reads task title, calls backend endpoint, updates description,
   * shows loading states, enforces rate limits, and displays disclaimers.
   */
  const handleGenerateAiDescription = async () => {
    // 1. Validate that title is entered before requesting AI description
    if (!title || title.trim() === '') {
      setAiError('Please enter a task title first to generate an AI description.');
      setAiSuccess(false);
      return;
    }

    setIsGeneratingAi(true);
    setAiError('');
    setAiSuccess(false);

    try {
      const response = await generateAiDescription({
        title: title.trim(),
        taskId: editingTask?._id || null,
        clientId
      });

      // Handle provider failure fallback
      if (response && response.fallback) {
        setAiError(response.message || 'AI suggestions are temporarily unavailable. Please enter your description manually.');
        setAiSuccess(false);
      } else if (response && response.description) {
        // Populate the editable description field with AI suggestion
        setDescription(response.description);
        setAiSuccess(true);
        setAiError('');
      } else {
        setAiError('AI suggestions are temporarily unavailable. Please enter your description manually.');
        setAiSuccess(false);
      }
    } catch (err) {
      // Handle rate limit (429) or network/provider errors
      if (err.status === 429 || err.message?.includes('minute')) {
        setAiError(err.message || 'Please wait one minute before generating another AI description.');
      } else {
        setAiError(err.message || 'AI suggestions are temporarily unavailable. Please enter your description manually.');
      }
      setAiSuccess(false);
    } finally {
      setIsGeneratingAi(false);
    }
  };

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
      setAiError('');
      setAiSuccess(false);
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
            placeholder="e.g. Complete Practical 13 AI Integration"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (aiError && e.target.value.trim()) {
                setAiError('');
              }
            }}
            disabled={isSubmitting || isGeneratingAi}
            required
          />
        </div>

        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="task-description" className="form-label" style={{ marginBottom: 0 }}>
              Description
            </label>
            <button
              type="button"
              className="btn-ai-generate"
              onClick={handleGenerateAiDescription}
              disabled={isGeneratingAi || isSubmitting}
              title="Generate task description using AI"
            >
              {isGeneratingAi ? (
                <span className="btn-loading-content">
                  <span className="mini-spinner" /> Generating...
                </span>
              ) : (
                <span>✨ Generate description</span>
              )}
            </button>
          </div>

          <textarea
            id="task-description"
            className="form-textarea"
            rows="3"
            placeholder="Optional task details (click '✨ Generate description' for AI assistance)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting || isGeneratingAi}
          />

          {/* AI Graceful Error / Fallback Notification */}
          {aiError && (
            <div className="ai-error-box" role="alert">
              <span>⚠️</span>
              <span>{aiError}</span>
            </div>
          )}

          {/* AI Disclaimer Box */}
          {aiSuccess && (
            <div className="ai-disclaimer-box" role="status">
              <span>🤖</span>
              <span><strong>AI-generated suggestion.</strong> Please review and edit before saving.</span>
            </div>
          )}
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
              disabled={isSubmitting || isGeneratingAi}
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
                  disabled={isSubmitting || isGeneratingAi}
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
              disabled={isSubmitting || isGeneratingAi}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || isGeneratingAi}
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
