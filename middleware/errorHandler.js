/**
 * Global Error-Handling Middleware for Practical 5
 * Intercepts Mongoose validation errors, CastErrors, syntax errors, and uncaught exceptions.
 * Returns clean, structured JSON errors without exposing server stack traces or database credentials.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] ${err.name || 'Error'}: ${err.message}`);

  // 1. Mongoose Schema Validation Error (e.g. Missing required title, invalid enum value)
  if (err.name === 'ValidationError') {
    const details = Object.keys(err.errors || {}).map((field) => ({
      field,
      message: err.errors[field].message
    }));

    return res.status(400).json({
      error: 'Validation failed',
      details
    });
  }

  // 2. Mongoose Invalid ObjectId CastError
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid task ID'
    });
  }

  // 3. Express body-parser Malformed JSON SyntaxError
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Malformed JSON payload. Please verify request body syntax.'
    });
  }

  // 4. Default Internal Server Error (500)
  const statusCode = err.status || err.statusCode || 500;
  return res.status(statusCode).json({
    error: err.message || 'Internal Server Error'
  });
};

export default errorHandler;
