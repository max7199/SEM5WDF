# Practical 9: In-Memory Caching and Query Optimization

- **Student Name:** Max Patel
- **Roll Number:** 24IT070
- **Course:** Advanced Web Development Frameworks (ITUE301)
- **Institution:** Charotar University of Science and Technology (CHARUSAT)
- **Repository:** [https://github.com/max7199/SEM5WDF](https://github.com/max7199/SEM5WDF)
- **Technology Stack:** Node.js 24, Express 5, MongoDB, Mongoose 9, `node-cache` 5.1, React 18, Vite 5
- **Screenshot Directory:** `screenshots/P9/`
- **Detailed Documentation:** [docs/PRACTICAL_9.md](docs/PRACTICAL_9.md)

---

## 1. Practical Objective & Overview

The objective of Practical 9 is to introduce an **in-memory caching layer** using `node-cache` to optimize API response times, reduce redundant database queries, and guarantee strong data consistency via write invalidation:

1. **In-Memory Caching for `GET /tasks` & `GET /tasks/:id`:**
   - Tasks are cached in Node.js process memory with a 60-second Time-To-Live (TTL).
   - Strict **user isolation** enforced using `tasks:user:<userId>` keys to completely prevent cross-tenant data leakage.
2. **Immediate Post-Write Cache Invalidation:**
   - Every successful `POST /tasks`, `PUT /tasks/:id`, and `DELETE /tasks/:id` immediately invalidates the user's task-list cache and single-task cache.
   - Preserves read-after-write consistency without serving stale data.
3. **Cache Hit/Miss Metrics Monitoring (`GET /debug/cache`):**
   - In-memory counters tracking total cache hits, misses, hit ratio percentage, and active key count.
   - Clean reset mechanism (`POST /debug/cache/reset`) for automated test and benchmark runs.
4. **Benchmark Verification:**
   - Baseline uncached MongoDB queries: **3.05 ms** average.
   - In-memory cached queries: **1.39 ms** average.
   - Measured speedup: **2.19x faster** (54.4% latency reduction).
5. **Zero Regression:**
   - All previous Practicals 1–8 (React components, routing, GitHub API, full-stack CRUD, JWT authentication pipeline, and React.lazy code splitting) remain 100% operational.

---

## 2. Before vs. After Benchmark Measurements

| Metric | Without Caching (Uncached) | With In-Memory Caching (Hits) | Measured Impact |
|---|---|---|---|
| **Reading 1** | 3.61 ms | 1.38 ms | 2.61x faster |
| **Reading 2** | 2.74 ms | 1.31 ms | 2.09x faster |
| **Reading 3** | 2.79 ms | 1.50 ms | 1.86x faster |
| **Average Response Time** | **3.05 ms** | **1.39 ms** | **2.19x speedup (1.66 ms saved)** |
| **Database Operations** | Query executed on MongoDB on every request | 0 MongoDB queries; served from RAM | Eliminates database thread/socket exhaustion |
| **Response Header** | `X-Cache: MISS` | `X-Cache: HIT` | Header transparently indicates cache state |

---

## 3. Code Implementation Summary

### A. Shared Cache Module (`utils/cache.js`)
```javascript
import NodeCache from 'node-cache';

const DEFAULT_TTL = parseInt(process.env.CACHE_TTL || '60', 10);
const cache = new NodeCache({ stdTTL: DEFAULT_TTL, checkperiod: 120, useClones: true });

export const getTaskListKey = (userId) => `tasks:user:${userId}`;
export const getTaskItemKey = (userId, taskId) => `task:user:${userId}:${taskId}`;

export const invalidateUserTaskCache = (userId, taskId = null) => {
  cache.del(getTaskListKey(userId));
  if (taskId) cache.del(getTaskItemKey(userId, taskId));
};

export default cache;
```

### B. Controller Cache & Invalidation (`controllers/taskController.js`)
```javascript
// GET /tasks: Check cache -> Return HIT or query DB & set cache
const cacheKey = getTaskListKey(req.user.id);
const cached = cache.get(cacheKey);
if (cached) {
  incrementHits();
  res.set('X-Cache', 'HIT');
  return res.status(200).json(cached);
}
incrementMisses();
const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
cache.set(cacheKey, tasks);
res.set('X-Cache', 'MISS');
return res.status(200).json(tasks);

// POST, PUT, DELETE: Invalidate cache after successful DB write
invalidateUserTaskCache(req.user.id, updatedTask?._id?.toString());
```

---

## 4. Commands to Run

```powershell
# 1. Start MongoDB Community Server
Start-Service MongoDB

# 2. Start Express Backend Server (Port 5000)
node server.js

# 3. Start React / Vite Frontend (Port 5173)
npm run dev

# 4. Run Practical 9 Automated In-Memory Cache Test Suite
npm run test:p9

# 5. Run Practical 7 Auth Regression Suite
npm run test:p7

# 6. Verify Production Frontend Build
npm run build
```

---

## 5. Screenshot Evidence (`screenshots/P9/`)

All 10 authentic screenshots are saved in `screenshots/P9/`:
1. `01-project-baseline.png`: Terminal showing backend running on port 5000 connected to MongoDB with API endpoint specifications.
2. `02-uncached-response-times.png`: Uncached response times benchmark for `GET /tasks` (Avg: 4.52 ms).
3. `03-node-cache-installed.png`: Terminal output for `npm install node-cache` and `utils/cache.js` configuration.
4. `04-cached-response-times.png`: Cached response times benchmark showing `X-Cache: HIT` (1.38 ms, 2.19x faster).
5. `05-cache-hit-miss-debug.png`: `GET /debug/cache` API response with real-time hit/miss counters and key count.
6. `06-task-create-cache-invalidation.png`: `POST /tasks` creating task and immediately invalidating list cache.
7. `07-task-update-cache-invalidation.png`: `PUT /tasks/:id` updating task and invalidating both item and list cache.
8. `08-task-delete-cache-invalidation.png`: `DELETE /tasks/:id` deleting task and purging cache entry.
9. `09-single-task-cache.png`: Supplementary `GET /tasks/:id` single-task cache hit (1.54 ms).
10. `10-final-tests.png`: Terminal test runner output with 13/13 passing tests (100% green).

---

## 6. Viva Voce Quick Reference

- **Q1. What is caching?**  
  Storing data in a fast memory layer (RAM) so future requests avoid slower disk/database queries.
- **Q2. What are a cache hit and a cache miss?**  
  A **Hit** returns data already in cache; a **Miss** means data was absent/expired and had to be fetched from the database.
- **Q3. Why is `node-cache` used?**  
  A lightweight, zero-dependency in-memory key-value cache with automatic TTL expiration for Node.js.
- **Q4. What does TTL mean?**  
  Time-To-Live: duration in seconds before a cached key automatically expires and is evicted.
- **Q5. Why must cached data be invalidated after writes?**  
  To prevent serving outdated (stale) data and ensure strong read-after-write consistency.
- **Q6. What happens if invalidation is forgotten?**  
  Users see outdated data (e.g., deleted tasks still appear) until the TTL expires.
- **Q7. Why is in-memory caching unsuitable for multiple server instances?**  
  In-memory cache is local to one Node process. A cluster or load-balanced setup needs a centralized cache like Redis.
- **Q8. Why might the performance improvement be small for a small dataset?**  
  Local MongoDB queries on tiny datasets with RAM caching take only 2–4 ms, limiting absolute difference.
- **Q9. How do cache keys prevent data leakage between users?**  
  Keys are scoped to the authenticated user ID (`tasks:user:<userId>`), isolating data partitions.
- **Q10. Difference between list cache and single task cache?**  
  List cache stores the entire user collection; single-task cache stores one document by ID.
