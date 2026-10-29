import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authentication Controller for Practical 7
 * Handles User Registration, Login, and Profile (/me) retrieval.
 * Student: Max Patel (24IT070) - CHARUSAT - ITUE301
 */

// POST /register (or /auth/register)
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Check for existing user with identical email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email is already registered'
      });
    }

    // Hash the password with bcrypt (salt rounds = 10)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save new user
    const newUser = await User.create({
      email: normalizedEmail,
      password: hashedPassword
    });

    // Return safe user details (HTTP 201 Created) without exposing password hash
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /login (or /auth/login)
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Find user by normalized email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Compare plain password with bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Ensure JWT secret is present
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[authController] JWT_SECRET is not configured in .env');
      return res.status(500).json({
        success: false,
        error: 'Internal server error: Authentication secret not configured'
      });
    }

    // Generate JWT token with 1-hour expiration
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      secret,
      { expiresIn: '1h' }
    );

    // Return token and safe user details
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /me (or /auth/me) - Protected
export const getMe = async (req, res, next) => {
  try {
    // req.user was set by authMiddleware
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found or account no longer exists'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};
