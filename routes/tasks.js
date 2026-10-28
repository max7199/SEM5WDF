import express from 'express';
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import validateTaskId from '../middleware/validateTaskId.js';

const router = express.Router();

/**
 * Task Management Routes
 * Base path: /tasks
 */

// GET /tasks - Return all tasks (200 OK)
router.get('/', getAllTasks);

// POST /tasks - Create a new task (201 Created)
router.post('/', createTask);

// PUT /tasks/:id - Update an existing task by ID (200 OK)
router.put('/:id', validateTaskId, updateTask);

// DELETE /tasks/:id - Delete an existing task by ID (200 OK)
router.delete('/:id', validateTaskId, deleteTask);

export default router;
