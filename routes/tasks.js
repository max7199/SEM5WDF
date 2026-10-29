import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import validateTaskId from '../middleware/validateTaskId.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateTaskCreate, validateTaskUpdate } from '../middleware/validation.js';

const router = express.Router();

/**
 * Task Management Routes for Practical 7
 * Base Path: /tasks
 * All task routes are protected by authMiddleware.
 */

// Apply authMiddleware globally to all task routes
router.use(authMiddleware);

// GET /tasks - Return all tasks belonging to the authenticated user
router.get('/', getAllTasks);

// GET /tasks/:id - Return a single task by MongoDB ID
router.get('/:id', validateTaskId, getTaskById);

// POST /tasks - Create a new task in MongoDB with validation
router.post('/', validateTaskCreate, createTask);

// PUT /tasks/:id - Update an existing task by ID with validation
router.put('/:id', validateTaskId, validateTaskUpdate, updateTask);

// DELETE /tasks/:id - Delete an existing task by ID
router.delete('/:id', validateTaskId, deleteTask);

export default router;
