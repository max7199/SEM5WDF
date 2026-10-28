import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import validateTaskId from '../middleware/validateTaskId.js';

const router = express.Router();

/**
 * Task Management Routes for Practical 5
 * Base Path: /tasks
 */

// GET /tasks - Return all tasks from MongoDB
router.get('/', getAllTasks);

// GET /tasks/:id - Return a single task by MongoDB ID
router.get('/:id', validateTaskId, getTaskById);

// POST /tasks - Create a new task in MongoDB
router.post('/', createTask);

// PUT /tasks/:id - Update an existing task by ID with schema validation
router.put('/:id', validateTaskId, updateTask);

// DELETE /tasks/:id - Delete an existing task by ID
router.delete('/:id', validateTaskId, deleteTask);

export default router;
