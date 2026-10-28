/**
 * Global Request Logging Middleware
 * Logs HTTP method, requested URL, and an ISO timestamp for every incoming request.
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl || req.url}`);
  next();
};

export default logger;
