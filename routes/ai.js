// =============================================================================
// Practical 13: AI API Integration into a Web Application
// File: routes/ai.js
// Description: Express Router mounting AI endpoints (/api/ai/generate-description).
// Student: Max Patel (24IT070) - CHARUSAT - ITUE301
// =============================================================================

import express from 'express';
import jwt from 'jsonwebtoken';
import { generateDescription } from '../controllers/aiController.js';

const router = express.Router();

/**
 * Optional authentication helper:
 * Decodes user token if provided, but allows direct testing/generation without blocking.
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET;
      if (secret) {
        const decoded = jwt.verify(token, secret);
        req.user = { id: decoded.id, email: decoded.email };
      }
    } catch {
      // Token expired or invalid: continue gracefully without blocking AI generation
    }
  }
  next();
};

/**
 * POST /api/ai/generate-description
 * Body: { "title": "...", "taskId": "...", "clientId": "..." }
 */
router.post('/generate-description', optionalAuth, generateDescription);

export default router;
