// =============================================================================
// Practical 9: In-Memory Caching and Query Optimization
// File: utils/cache.js
// Description: Shared in-memory caching module using node-cache with TTL,
//              user-isolated cache keys, hit/miss metrics, and invalidation helpers.
// =============================================================================

import NodeCache from 'node-cache';

// Configurable default TTL (60 seconds) and cleanup checkperiod (120 seconds)
const DEFAULT_TTL = parseInt(process.env.CACHE_TTL || '60', 10);
const CHECK_PERIOD = 120;

const cache = new NodeCache({
  stdTTL: DEFAULT_TTL,
  checkperiod: CHECK_PERIOD,
  useClones: true // Clones objects to prevent mutation of cached data in memory
});

// In-memory counters for cache hits and misses
let totalHits = 0;
let totalMisses = 0;

/**
 * Increment the global cache hit counter
 */
export const incrementHits = () => {
  totalHits += 1;
};

/**
 * Increment the global cache miss counter
 */
export const incrementMisses = () => {
  totalMisses += 1;
};

/**
 * Get current cache metrics and configuration
 */
export const getCacheMetrics = () => {
  return {
    hits: totalHits,
    misses: totalMisses,
    totalRequests: totalHits + totalMisses,
    hitRatio: totalHits + totalMisses > 0
      ? Number(((totalHits / (totalHits + totalMisses)) * 100).toFixed(2))
      : 0,
    keysCount: cache.keys().length,
    keys: cache.keys(),
    stdTTL: DEFAULT_TTL,
    checkperiod: CHECK_PERIOD
  };
};

/**
 * Reset cache metrics and flush all keys (useful for testing and benchmarking)
 */
export const resetCache = () => {
  totalHits = 0;
  totalMisses = 0;
  cache.flushAll();
  return {
    message: 'Cache flushed and metrics reset successfully',
    hits: 0,
    misses: 0,
    keysCount: 0
  };
};

/**
 * Generate stable cache key for a user's task list
 * Enforces strict user isolation: tasks:user:<userId>
 */
export const getTaskListKey = (userId) => {
  return `tasks:user:${userId}`;
};

/**
 * Generate stable cache key for an individual task
 * Enforces strict user isolation: task:user:<userId>:<taskId>
 */
export const getTaskItemKey = (userId, taskId) => {
  return `task:user:${userId}:${taskId}`;
};

/**
 * Invalidate cached task data for a specific user after write operations (POST, PUT, DELETE)
 * - Always invalidates the user's task list (since counts, order, or content changed)
 * - If a taskId is provided, also invalidates that specific task's cache entry
 */
export const invalidateUserTaskCache = (userId, taskId = null) => {
  const listKey = getTaskListKey(userId);
  cache.del(listKey);

  if (taskId) {
    const itemKey = getTaskItemKey(userId, taskId);
    cache.del(itemKey);
  }
};

export default cache;
