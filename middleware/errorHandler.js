/**
 * Global Error-Handling Middleware for Practical 7
 * Intercepts Mongoose validation errors, duplicate key errors, CastErrors,
 * JWT authentication errors, and syntax errors.
 * Returns clean, structured JSON errors without exposing server stack traces or database credentials.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] ${err.name || 'Error'}: ${err.message}`);

  // 1. Mongoose Duplicate Key Error (E11000, e.g. duplicate email registration)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(400).json({
      success: false,
      error: `Duplicate value entered for ${field}. A user with this ${field} already exists.`
    });
  }

  // 2. Mongoose Schema Validation Error (e.g. Missing required title, invalid enum value)
  if (err.name === 'ValidationError') {
    const details = Object.keys(err.errors || {}).map((field) => ({
      field,
      message: err.errors[field].message
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details
    });
  }

  // 3. Mongoose Invalid ObjectId CastError
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format'
    });
  }

  // 4. JWT Authentication Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Token has expired'
    });
  }

  // 5. Express body-parser Malformed JSON SyntaxError
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Malformed JSON payload. Please verify request body syntax.'
    });
  }

  // 6. Default Internal Server Error (500)
  const statusCode = err.status || err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};

export default errorHandler;
