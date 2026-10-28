import { getTaskById } from '../controllers/taskController.js';

/**
 * Route-Specific Task ID Validation Middleware
 * Validates that :id is a positive integer and that the task exists in memory.
 * - Returns 400 Bad Request if ID format is invalid.
 * - Returns 404 Not Found if no task exists with that ID.
 */
const validateTaskId = (req, res, next) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  // Check if ID is a valid positive integer
  if (isNaN(parsedId) || parsedId <= 0 || !/^\d+$/.test(id.trim())) {
    return res.status(400).json({
      success: false,
      error: 'Invalid task ID format. Task ID must be a positive integer.'
    });
  }

  // Check if task exists in memory
  const task = getTaskById(parsedId);
  if (!task) {
    return res.status(404).json({
      success: false,
      error: `Task with ID ${parsedId} not found.`
    });
  }

  // Attach verified task and taskId to request
  req.task = task;
  req.taskId = parsedId;
  next();
};

export default validateTaskId;
