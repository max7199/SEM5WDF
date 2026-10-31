// =============================================================================
// Practical 9: In-Memory Caching and Query Optimization
// File: controllers/taskController.js
// Description: User-isolated task CRUD controller with node-cache integration,
//              on-demand hit/miss metrics, and post-write cache invalidation.
// =============================================================================

import Task from '../models/Task.js';
import cache, {
  incrementHits,
  incrementMisses,
  getTaskListKey,
  getTaskItemKey,
  invalidateUserTaskCache
} from '../utils/cache.js';

/**
 * Task Controller for Practical 9
 * All task queries enforce user isolation: users can only view,
 * create, update, and delete tasks associated with their own user ID.
 * In-memory caching stores task lists and single tasks per-user with a 60s TTL.
 */

// GET /tasks — Fetch all tasks belonging to the authenticated user (with caching)
export const getAllTasks = async (req, res, next) => {
  try {
    const cacheKey = getTaskListKey(req.user.id);
    const cachedTasks = cache.get(cacheKey);

    if (cachedTasks !== undefined) {
      incrementHits();
      res.set('X-Cache', 'HIT');
      return res.status(200).json(cachedTasks);
    }

    // Cache Miss: Query MongoDB
    incrementMisses();
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });

    // Store in cache for configured TTL
    cache.set(cacheKey, tasks);
    res.set('X-Cache', 'MISS');

    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// GET /tasks/:id — Fetch a single task by ID for the authenticated user (with caching)
export const getTaskById = async (req, res, next) => {
  try {
    const cacheKey = getTaskItemKey(req.user.id, req.params.id);
    const cachedTask = cache.get(cacheKey);

    if (cachedTask !== undefined) {
      incrementHits();
      res.set('X-Cache', 'HIT');
      return res.status(200).json(cachedTask);
    }

    // Cache Miss: Query MongoDB
    incrementMisses();
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    // Store in cache for configured TTL
    cache.set(cacheKey, task);
    res.set('X-Cache', 'MISS');

    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// POST /tasks — Create and save a new task; invalidate user task list cache
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

    // Invalidate user's task list cache after successful write
    invalidateUserTaskCache(req.user.id);

    return res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

// PUT /tasks/:id — Update an existing task; invalidate user task list and single task cache
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

    // Invalidate both user's task list and the specific task entry after successful update
    invalidateUserTaskCache(req.user.id, updatedTask._id.toString());

    return res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// DELETE /tasks/:id — Delete a task; invalidate user task list and single task cache
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

    // Invalidate both user's task list and the specific task entry after successful deletion
    invalidateUserTaskCache(req.user.id, deletedTask._id.toString());

    return res.status(200).json({
      message: 'Task deleted successfully',
      id: deletedTask._id
    });
  } catch (error) {
    next(error);
  }
};
