import jwt from 'jsonwebtoken';

/**
 * Authentication Middleware for Practical 7
 * Validates JWT in the Authorization header: "Bearer <token>"
 * Sets req.user = { id: decoded.id, email: decoded.email }
 * Returns HTTP 401 for missing, invalid, or expired tokens.
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Access denied: No authorization header provided'
      });
    }

    // Require "Bearer <token>" format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        error: 'Invalid authorization format. Format must be "Bearer <token>"'
      });
    }

    const token = parts[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied: Token is missing'
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[authMiddleware] Server configuration error: JWT_SECRET is not set');
      return res.status(500).json({
        success: false,
        error: 'Internal server error: Authentication secret not configured'
      });
    }

    // Verify token using JWT_SECRET
    const decoded = jwt.verify(token, secret);

    // Attach decoded user payload to request
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Session expired: Token has expired. Please log in again.'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid or tampered token'
      });
    }

    return res.status(401).json({
      success: false,
      error: `Authentication failed: ${error.message}`
    });
  }
};

export default authMiddleware;
