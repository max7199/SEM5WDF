// =============================================================================
// Practical 9: In-Memory Caching and Query Optimization
// File: routes/debug.js
// Description: Debug endpoints for monitoring in-memory cache hits, misses,
//              active keys count, TTL configuration, and test cache flushing.
// =============================================================================

import express from 'express';
import { getCacheMetrics, resetCache } from '../utils/cache.js';

const router = express.Router();

/**
 * GET /debug/cache
 * Returns current cache statistics: total hits, misses, hit ratio, active key count, and TTL.
 * Sensitive task contents are NOT exposed, maintaining complete data security.
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
 * Flushes all cached keys and resets hit/miss counters (for testing and benchmark runs).
 */
router.post('/cache/reset', (req, res) => {
  const result = resetCache();
  return res.status(200).json({
    success: true,
    message: result.message,
    data: result
  });
});

export default router;
