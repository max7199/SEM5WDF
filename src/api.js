/**
 * Centralized API Utility for Practical 6: Full-Stack Integration
 * Connects the React frontend to the Express + MongoDB backend.
 * Student: Max Patel (24IT070) - CHARUSAT - ITUE301
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Generic fetch wrapper with robust error handling and status code verification
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(url, config);
    let data = null;

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      let errorMessage = 'Request failed';
      let errorDetails = null;

      if (data && typeof data === 'object') {
        errorMessage = data.error || data.message || `HTTP ${res.status}: ${res.statusText}`;
        errorDetails = data.details || null;
      } else if (typeof data === 'string' && data.length > 0) {
        errorMessage = data;
      }

      const error = new Error(errorMessage);
      error.status = res.status;
      error.details = errorDetails;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const netErr = new Error(
        `Cannot connect to backend server at ${API_BASE_URL}. Please ensure the Node.js Express server is running on port 5000.`
      );
      netErr.isNetworkError = true;
      throw netErr;
    }
    throw err;
  }
}

/**
 * 1. Fetch all tasks from MongoDB (GET /tasks)
 */
export async function getTasks() {
  return await request('/tasks');
}

/**
 * 2. Fetch single task by ID (GET /tasks/:id)
 */
export async function getTask(id) {
  return await request(`/tasks/${id}`);
}

/**
 * 3. Create a new task (POST /tasks)
 */
export async function createTask(taskData) {
  return await request('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData)
  });
}

/**
 * 4. Update an existing task (PUT /tasks/:id)
 */
export async function updateTask(id, taskData) {
  return await request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData)
  });
}

/**
 * 5. Delete an existing task (DELETE /tasks/:id)
 */
export async function deleteTask(id) {
  return await request(`/tasks/${id}`, {
    method: 'DELETE'
  });
}

export default {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  API_BASE_URL
};
