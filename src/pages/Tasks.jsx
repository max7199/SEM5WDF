import React, { useState, useEffect, useCallback } from 'react';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getMe,
  logout,
  getStoredUser,
  getStoredToken
} from '../api';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import AuthCard from '../components/AuthCard';

/**
 * Task Management Page for Practical 7: Authentication & Middleware Pipeline
 * Subject: Advanced Web Development Frameworks (ITUE301) - CHARUSAT
 * Student: Max Patel (24IT070)
 */
function Tasks() {
  // Authentication states
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [authToken, setAuthToken] = useState(getStoredToken());
  const [userProfileData, setUserProfileData] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isVerifyingMe, setIsVerifyingMe] = useState(false);

  // Task list states
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation Modal state
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | pending | completed
  const [priorityFilter, setPriorityFilter] = useState('all'); // all | low | medium | high

  // Helper to add toast notification
  const addToast = (message, type = 'info', details = null) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, details }]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync authentication state from sessionStorage / custom event
  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getStoredUser());
      setAuthToken(getStoredToken());
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  // 1. Fetch all tasks from MongoDB via GET /tasks (Protected)
  const loadTasks = useCallback(async () => {
    if (!getStoredToken()) {
      setTasks([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      if (err.status === 401) {
        addToast('Session expired or unauthorized. Please log in again.', 'error');
        setCurrentUser(null);
        setAuthToken(null);
        setTasks([]);
      } else {
        setError(err.message || 'Unable to connect to the backend server.');
        addToast(err.message || 'Unable to load tasks from server.', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tasks when authenticated
  useEffect(() => {
    if (authToken) {
      loadTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [authToken, loadTasks]);

  // Handle Logout
  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setAuthToken(null);
    setTasks([]);
    setEditingTask(null);
    addToast('You have been logged out successfully.', 'info');
  };

  // Verify /me endpoint live
  const handleCheckMe = async () => {
    setIsVerifyingMe(true);
    try {
      const data = await getMe();
      setUserProfileData(data.user);
      setIsProfileModalOpen(true);
      addToast('Profile verified successfully from /me endpoint!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to verify /me profile', 'error');
    } finally {
      setIsVerifyingMe(false);
    }
  };

  // 2. Create Task (POST /tasks) with Optimistic UI
  const handleCreateTask = async (taskData) => {
    setIsSubmitting(true);

    const tempId = `temp-${Date.now()}`;
    const optimisticTask = {
      _id: tempId,
      ...taskData,
      createdAt: new Date().toISOString(),
      isOptimistic: true
    };

    setTasks((prev) => [optimisticTask, ...prev]);

    try {
      const savedTask = await createTask(taskData);
      setTasks((prev) =>
        prev.map((t) => (t._id === tempId ? savedTask : t))
      );
      addToast('Task created successfully in MongoDB!', 'success');
      return true;
    } catch (err) {
      console.error('Error creating task:', err);
      setTasks((prev) => prev.filter((t) => t._id !== tempId));
      if (err.status === 401) {
        handleLogout();
      }
      addToast(err.message || 'Failed to create task.', 'error', err.details);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Update Task (PUT /tasks/:id)
  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return false;
    setIsSubmitting(true);

    try {
      const updated = await updateTask(editingTask._id, taskData);
      setTasks((prev) =>
        prev.map((t) => (t._id === editingTask._id ? updated : t))
      );
      setEditingTask(null);
      addToast('Task updated successfully!', 'success');
      return true;
    } catch (err) {
      console.error('Error updating task:', err);
      if (err.status === 401) {
        handleLogout();
      }
      addToast(err.message || 'Failed to update task.', 'error', err.details);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Toggle Task Completion Status (PUT /tasks/:id)
  const handleToggleComplete = async (task) => {
    const updatedStatus = !task.completed;

    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id ? { ...t, completed: updatedStatus } : t
      )
    );

    try {
      await updateTask(task._id, { completed: updatedStatus });
      addToast(
        `Task marked as ${updatedStatus ? 'completed' : 'pending'}!`,
        'success'
      );
    } catch (err) {
      console.error('Failed to update completion status:', err);
      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, completed: task.completed } : t
        )
      );
      if (err.status === 401) {
        handleLogout();
      }
      addToast('Failed to update task status.', 'error');
    }
  };

  // 5. Delete Task confirmation & execution (DELETE /tasks/:id)
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);

    try {
      await deleteTask(taskToDelete._id);
      setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
      addToast('Task deleted successfully from MongoDB!', 'success');
      setTaskToDelete(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      if (err.status === 401) {
        handleLogout();
      }
      addToast(err.message || 'Failed to delete task.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'completed'
        ? task.completed === true
        : task.completed === false;

    const matchesPriority =
      priorityFilter === 'all'
        ? true
        : task.priority?.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="tasks-page-container">
      {/* Toast Notification Stack */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Confirmation Dialog for Delete Action */}
      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        title="Delete Task Confirmation"
        message={`Are you sure you want to permanently delete "${taskToDelete?.title}" from MongoDB?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
        isDeleting={isDeleting}
      />

      {/* Profile Modal for /me verification */}
      {isProfileModalOpen && userProfileData && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">🔐 Authenticated User Profile (/me)</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsProfileModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-message">
                Safe user details retrieved directly from MongoDB using verified JWT:
              </p>
              <div className="profile-details-box">
                <div className="profile-row">
                  <span className="profile-key">User ID:</span>
                  <span className="profile-val">{userProfileData.id}</span>
                </div>
                <div className="profile-row">
                  <span className="profile-key">Email:</span>
                  <span className="profile-val">{userProfileData.email}</span>
                </div>
                <div className="profile-row">
                  <span className="profile-key">Account Created:</span>
                  <span className="profile-val">
                    {new Date(userProfileData.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="profile-row">
                  <span className="profile-key">Password:</span>
                  <span className="profile-val safe-badge">
                    🔒 Protected (Bcrypt hash excluded)
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsProfileModalOpen(false)}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header Banner */}
      <div className="tasks-header-banner">
        <div className="tasks-header-content">
          <span className="tasks-badge">Practical 7 &bull; Authentication & Middleware Pipeline</span>
          <h2 className="tasks-heading">Protected Task Management</h2>
          <p className="tasks-subheading">
            Live integration with JWT authentication, Bcrypt password hashing, and user-isolated task collections.
          </p>
        </div>

        {/* User Session Status Pill */}
        {authToken && currentUser && (
          <div className="auth-status-card">
            <div className="auth-user-info">
              <span className="auth-avatar">👤</span>
              <div>
                <div className="auth-user-email">{currentUser.email}</div>
                <div className="auth-user-status">
                  <span className="status-dot-green"></span> Token Active (1h)
                </div>
              </div>
            </div>
            <div className="auth-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleCheckMe}
                disabled={isVerifyingMe}
                title="Verify /me endpoint"
              >
                {isVerifyingMe ? 'Checking...' : '👤 My Profile (/me)'}
              </button>
              <button
                type="button"
                className="btn btn-logout btn-sm"
                onClick={handleLogout}
                title="Log out of session"
              >
                🚪 Log Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* If NOT Authenticated: Show AuthCard */}
      {!authToken ? (
        <AuthCard
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            setAuthToken(getStoredToken());
          }}
          addToast={addToast}
        />
      ) : (
        /* If Authenticated: Show Full Task Management Dashboard */
        <div className="tasks-layout-grid">
          {/* Left Column: Create or Edit Form */}
          <div className="tasks-form-column">
            <TaskForm
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              editingTask={editingTask}
              onCancelEdit={() => setEditingTask(null)}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Right Column: Search, Filter, and Task List */}
          <div className="tasks-list-column">
            {/* Controls Bar */}
            <div className="tasks-controls-card">
              <div className="search-input-wrap">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="task-search-input"
                  placeholder="Search your tasks by title or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-group-wrap">
                <div className="filter-pill-group">
                  <button
                    type="button"
                    className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('all')}
                  >
                    All ({tasks.length})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${statusFilter === 'pending' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('pending')}
                  >
                    Pending ({tasks.filter((t) => !t.completed).length})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${statusFilter === 'completed' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('completed')}
                  >
                    Completed ({tasks.filter((t) => t.completed).length})
                  </button>
                </div>

                <select
                  className="priority-filter-select"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  aria-label="Filter by priority"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">🔴 High Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="low">🟢 Low Priority</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="tasks-status-area">
                <Spinner />
                <p className="loading-caption">Fetching authenticated user tasks from MongoDB...</p>
              </div>
            )}

            {/* Error State with Retry Button */}
            {!loading && error && (
              <ErrorMessage
                message={error}
                onRetry={loadTasks}
              />
            )}

            {/* Empty State */}
            {!loading && !error && filteredTasks.length === 0 && (
              <div className="empty-tasks-card">
                <span className="empty-icon">📋</span>
                <h4 className="empty-title">
                  {tasks.length === 0
                    ? 'No tasks created yet for this account'
                    : 'No tasks match your search or filter'}
                </h4>
                <p className="empty-desc">
                  {tasks.length === 0
                    ? 'Use the form on the left to create your first personal task.'
                    : 'Try clearing your search term or selecting another filter.'}
                </p>
                {tasks.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setPriorityFilter('all');
                    }}
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}

            {/* Tasks List */}
            {!loading && !error && filteredTasks.length > 0 && (
              <div className="tasks-grid">
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={(t) => {
                      setEditingTask(t);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onDelete={(t) => setTaskToDelete(t)}
                    isUpdating={isSubmitting || isDeleting}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
