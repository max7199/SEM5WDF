/**
 * Validation Middleware for Practical 7
 * Enforces strict input validation for Authentication and Task endpoints.
 * Returns HTTP 400 Bad Request with descriptive error messages.
 */

// Email regex pattern for basic format verification
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const MIN_PASSWORD_LENGTH = 6;
const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Validates registration payload (email and password)
 */
export const validateRegister = (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Validation error: Email is required'
    });
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({
      success: false,
      error: 'Validation error: Please provide a valid email address'
    });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Validation error: Password is required'
    });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      success: false,
      error: `Validation error: Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    });
  }

  next();
};

/**
 * Validates login payload (email and password)
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Validation error: Email is required'
    });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Validation error: Password is required'
    });
  }

  next();
};

/**
 * Validates task creation payload (rejects missing, empty, or whitespace-only title)
 */
export const validateTaskCreate = (req, res, next) => {
  const { title, priority } = req.body || {};

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation error: Task title is required and cannot be empty or whitespace only'
    });
  }

  if (priority && !VALID_PRIORITIES.includes(priority.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: `Validation error: Priority must be one of: ${VALID_PRIORITIES.join(', ')}`
    });
  }

  next();
};

/**
 * Validates task update payload
 */
export const validateTaskUpdate = (req, res, next) => {
  const { title, priority } = req.body || {};

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation error: Task title cannot be empty or whitespace only'
      });
    }
  }

  if (priority !== undefined) {
    if (!VALID_PRIORITIES.includes(String(priority).toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Validation error: Priority must be one of: ${VALID_PRIORITIES.join(', ')}`
      });
    }
  }

  next();
};
