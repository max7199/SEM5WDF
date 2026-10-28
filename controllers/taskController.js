import Task from '../models/Task.js';

/**
 * Task Controller for Practical 5
 * Subject: Advanced Web Development Frameworks (ITUE301)
 * College: CHARUSAT
 * Student: Max Patel (24IT070)
 * Uses real MongoDB operations via Mongoose
 */

// GET /tasks — Fetch all tasks from MongoDB
export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// GET /tasks/:id — Fetch a single task by MongoDB ID
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

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

// POST /tasks — Create and save a new task in MongoDB
export const createTask = async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;

    const newTask = await Task.create({
      title,
      description,
      completed,
      priority
    });

    return res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

// PUT /tasks/:id — Update an existing task in MongoDB
export const updateTask = async (req, res, next) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
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

// DELETE /tasks/:id — Delete a task from MongoDB
export const deleteTask = async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

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
