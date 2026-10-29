import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Authentication Routes for Practical 7
 * Base Paths: /auth or mounted as /register, /login, /me
 */

// POST /register - Register a new user account
router.post('/register', validateRegister, register);

// POST /login - Authenticate user credentials and return JWT
router.post('/login', validateLogin, login);

// GET /me - Return currently authenticated user profile (protected)
router.get('/me', authMiddleware, getMe);

export default router;
