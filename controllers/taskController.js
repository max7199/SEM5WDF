/**
 * In-Memory Task Data Store and Controller for Practical 4
 * Student: Max Patel (24IT070)
 */

// In-memory array storing tasks
let tasks = [
  {
    id: 1,
    title: 'Complete Practical 1',
    description: 'React Component Architecture and Props',
    completed: true
  },
  {
    id: 2,
    title: 'Complete Practical 2',
    description: 'React State Management and React Router Navigation',
    completed: true
  },
  {
    id: 3,
    title: 'Complete Practical 3',
    description: 'GitHub REST API Integration with useState and useEffect',
    completed: true
  },
  {
    id: 4,
    title: 'Complete Practical 4',
    description: 'Build RESTful API with Node.js, Express, and Middleware',
    completed: false
  }
];

let nextId = 5;

// Helper function to find a task by ID
export const getTaskById = (id) => {
  return tasks.find((t) => t.id === id);
};

// GET /tasks — Retrieve all tasks (Status 200)
export const getAllTasks = (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// POST /tasks — Create a new task (Status 201)
export const createTask = (req, res, next) => {
  try {
    const { title, description = '', completed = false } = req.body;

    // Validate required title field
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: "title" is required and must be a non-empty string.'
      });
    }

    // Validate description if provided
    if (typeof description !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: "description" must be a string.'
      });
    }

    // Validate completed if provided
    if (typeof completed !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: "completed" must be a boolean (true or false).'
      });
    }

    const newTask = {
      id: nextId++,
      title: title.trim(),
      description: description.trim(),
      completed: completed
    };

    tasks.push(newTask);

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask
    });
  } catch (error) {
    next(error);
  }
};

// PUT /tasks/:id — Update an existing task (Status 200)
export const updateTask = (req, res, next) => {
  try {
    // req.task and req.taskId are pre-validated by validateTaskId middleware
    const task = req.task;
    const { title, description, completed } = req.body;

    // Ensure at least one field is provided for update
    if (title === undefined && description === undefined && completed === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: At least one field (title, description, or completed) must be provided to update.'
      });
    }

    // Validate title if provided
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Validation Error: "title" must be a non-empty string.'
        });
      }
      task.title = title.trim();
    }

    // Validate description if provided
    if (description !== undefined) {
      if (typeof description !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Validation Error: "description" must be a string.'
        });
      }
      task.description = description.trim();
    }

    // Validate completed if provided
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'Validation Error: "completed" must be a boolean.'
        });
      }
      task.completed = completed;
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /tasks/:id — Delete an existing task (Status 200)
export const deleteTask = (req, res, next) => {
  try {
    // req.task and req.taskId are pre-validated by validateTaskId middleware
    const taskId = req.taskId;
    const deletedTask = req.task;

    tasks = tasks.filter((t) => t.id !== taskId);

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: deletedTask
    });
  } catch (error) {
    next(error);
  }
};
