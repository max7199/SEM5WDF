// =============================================================================
// Practical 9 & 10: In-Memory Caching & Event-Driven Background Processing
// File: routes/debug.js
// Description: Debug endpoints for monitoring in-memory cache hits/misses
//              and background asynchronous notification events.
// =============================================================================

import express from 'express';
import { getCacheMetrics, resetCache } from '../utils/cache.js';
import { getNotificationHistory, clearNotificationHistory } from '../events/taskListeners.js';

const router = express.Router();

/**
 * GET /debug/cache
 * Returns current cache statistics: total hits, misses, hit ratio, active key count, and TTL.
 */
router.get('/cache', (req, res) => {
  const metrics = getCacheMetrics();
  return res.status(200).json({
    success: true,
    message: 'Cache debug metrics retrieved successfully',
    data: metrics
  });
});

/**
 * POST /debug/cache/reset
 * Flushes all cached keys and resets hit/miss counters.
 */
router.post('/cache/reset', (req, res) => {
  const result = resetCache();
  return res.status(200).json({
    success: true,
    message: result.message,
    data: result
  });
});

/**
 * GET /debug/notifications
 * Practical 10: Retrieve background task-created notification records.
 */
router.get('/notifications', (req, res) => {
  const history = getNotificationHistory();
  return res.status(200).json({
    success: true,
    message: 'Background notification event history retrieved successfully',
    count: history.length,
    data: history
  });
});

/**
 * POST /debug/notifications/reset
 * Practical 10: Reset background notification event history (for test isolation).
 */
router.post('/notifications/reset', (req, res) => {
  clearNotificationHistory();
  return res.status(200).json({
    success: true,
    message: 'Background notification history cleared successfully',
    count: 0
  });
});

export default router;
