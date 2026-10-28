/**
 * Content-Type Verification Middleware
 * Rejects POST and PUT requests without the 'Content-Type: application/json' header.
 * Returns HTTP 415 (Unsupported Media Type) with a structured JSON error.
 */
const checkContentType = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.toLowerCase().includes('application/json')) {
      return res.status(415).json({
        success: false,
        error: 'Unsupported Media Type: Content-Type header must be application/json'
      });
    }
  }
  next();
};

export default checkContentType;
