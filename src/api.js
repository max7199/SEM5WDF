/**
 * Centralized API Utility for Practical 7: Authentication & Middleware Pipeline
 * Connects the React frontend to the Express + MongoDB backend with JWT authentication.
 * Student: Max Patel (24IT070) - CHARUSAT - ITUE301
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const TOKEN_KEY = 'auth_jwt_token';
const USER_KEY = 'auth_user_data';

/**
 * Token and Session Storage Helpers
 */
export function getStoredToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

export function getStoredUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    sessionStorage.removeItem(USER_KEY);
  }
}

export function clearAuthSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event('authChange'));
}

export function isAuthenticated() {
  return Boolean(getStoredToken());
}

/**
 * Generic fetch wrapper with Bearer token injection, status code verification, and 401 handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getStoredToken();

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
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
      // Handle 401 Unauthorized: clear session if token was invalid/expired
      if (res.status === 401 && token) {
        clearAuthSession();
      }

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
 * ==========================================
 * AUTHENTICATION API METHODS (Practical 7)
 * ==========================================
 */

/**
 * 1. Register a new user account (POST /register)
 */
export async function register(email, password) {
  return await request('/register', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

/**
 * 2. Log in an existing user (POST /login)
 */
export async function login(email, password) {
  const data = await request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (data.token) {
    setStoredToken(data.token);
    if (data.user) {
      setStoredUser(data.user);
    }
    window.dispatchEvent(new Event('authChange'));
  }

  return data;
}

/**
 * 3. Log out current user
 */
export function logout() {
  clearAuthSession();
}

/**
 * 4. Fetch currently authenticated user profile (GET /me)
 */
export async function getMe() {
  return await request('/me');
}

/**
 * ==========================================
 * TASK MANAGEMENT API METHODS (Protected)
 * ==========================================
 */

/**
 * 5. Fetch all tasks from MongoDB (GET /tasks)
 */
export async function getTasks() {
  return await request('/tasks');
}

/**
 * 6. Fetch single task by ID (GET /tasks/:id)
 */
export async function getTask(id) {
  return await request(`/tasks/${id}`);
}

/**
 * 7. Create a new task (POST /tasks)
 */
export async function createTask(taskData) {
  return await request('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData)
  });
}

/**
 * 8. Update an existing task (PUT /tasks/:id)
 */
export async function updateTask(id, taskData) {
  return await request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData)
  });
}

/**
 * 9. Delete an existing task (DELETE /tasks/:id)
 */
export async function deleteTask(id) {
  return await request(`/tasks/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 10. Practical 13: Generate AI task description using OpenAI backend endpoint
 */
export async function generateAiDescription(payload) {
  return await request('/api/ai/generate-description', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export default {
  getStoredToken,
  setStoredToken,
  getStoredUser,
  setStoredUser,
  clearAuthSession,
  isAuthenticated,
  register,
  login,
  logout,
  getMe,
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  generateAiDescription,
  API_BASE_URL
};
