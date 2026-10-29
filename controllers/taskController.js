import Task from '../models/Task.js';

/**
 * Task Controller for Practical 7: Authentication & Middleware Pipeline
 * Subject: Advanced Web Development Frameworks (ITUE301)
 * College: CHARUSAT
 * Student: Max Patel (24IT070)
 *
 * All task queries enforce user isolation: users can only view,
 * create, update, and delete tasks associated with their own user ID.
 */

// GET /tasks — Fetch all tasks belonging to the authenticated user
export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// GET /tasks/:id — Fetch a single task by ID for the authenticated user
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// POST /tasks — Create and save a new task associated with the logged-in user
export const createTask = async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;

    const newTask = await Task.create({
      title,
      description,
      completed,
      priority,
      user: req.user.id
    });

    return res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

// PUT /tasks/:id — Update an existing task belonging to the authenticated user
export const updateTask = async (req, res, next) => {
  try {
    // Only allow updating safe task fields, prevent user field hijacking
    const updates = { ...req.body };
    delete updates.user;

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      updates,
      { new: true, returnDocument: 'after', runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// DELETE /tasks/:id — Delete a task belonging to the authenticated user
export const deleteTask = async (req, res, next) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!deletedTask) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    return res.status(200).json({
      message: 'Task deleted successfully',
      id: deletedTask._id
    });
  } catch (error) {
    next(error);
  }
};
