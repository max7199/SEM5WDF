/**
 * Global Error-Handling Middleware
 * Placed after all routes and the 404 handler.
 * Catches any unhandled errors or syntax errors (e.g. malformed JSON bodies)
 * and returns safe structured JSON without leaking stack traces.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] ${err.name || 'Error'}: ${err.message}`);

  // Handle malformed JSON body from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Malformed JSON payload. Please verify request body syntax.'
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    error: message
  });
};

export default errorHandler;
