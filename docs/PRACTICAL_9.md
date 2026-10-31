# Practical 9 — In-Memory Caching and Query Optimization

- **Course:** Advanced Web Development Frameworks (ITUE301)
- **Degree:** B.Tech Information Technology (Semester 5)
- **Institution:** Charotar University of Science and Technology (CHARUSAT)
- **Student Name:** Max Patel
- **Roll Number:** 24IT070
- **GitHub Repository:** [https://github.com/max7199/SEM5WDF](https://github.com/max7199/SEM5WDF)
- **Frontend Stack:** React 18.3, Vite 5.4, JavaScript (ES6+), React Router v7, CSS3
- **Backend Stack:** Node.js 24, Express 5.3, MongoDB Community, Mongoose 9.11, JWT, Bcrypt, `node-cache` 5.1
- **Screenshot Directory:** `screenshots/P9/`
- **Documentation File:** `docs/PRACTICAL_9.md`

---

## 1. Title and Objective

**Title:** In-Memory Caching and Query Optimization  
**Course Outcomes (CO) / Program Outcomes (PO):** CO1 / PO3, PO5

### Objective:
Optimize backend database throughput and eliminate repetitive database roundtrips by introducing an in-memory caching layer into the existing Task Management API using `node-cache`:
1. Implement in-memory caching for `GET /tasks` and `GET /tasks/:id` with strict user-data isolation to prevent cross-tenant data leakage.
2. Configure a default Time-To-Live (TTL) of 60 seconds with background eviction (120-second checkperiod).
3. Implement immediate post-write cache invalidation on `POST /tasks`, `PUT /tasks/:id`, and `DELETE /tasks/:id` to guarantee strong read-after-write consistency.
4. Expose in-memory cache monitoring counters (`hits`, `misses`, `hitRatio`, `keysCount`) via a dedicated debug endpoint (`GET /debug/cache`) and test reset mechanism (`POST /debug/cache/reset`).
5. Conduct a fair performance benchmark comparing real uncached MongoDB response times against in-memory cached response times.
6. Verify zero regression across all earlier practicals (Practicals 1–8).

---

## 2. In-Memory Caching Overview

### What is In-Memory Caching?
In-memory caching is a high-performance optimization strategy where frequently requested data is temporarily stored in RAM (the Node.js process heap) rather than querying secondary disk storage (MongoDB) on every incoming HTTP request.

Because reading from volatile RAM takes microseconds (nanoseconds for memory pointer lookups) compared to several milliseconds for network I/O, socket handshakes, BSON document deserialization, and Mongoose model casting, in-memory caching dramatically lowers CPU utilization, frees database connection pools, and accelerates API responsiveness.

---

## 3. Request Flow: Cache Hit vs. Cache Miss

```text
               Client Request: GET /tasks (Bearer Token)
                                │
                                ▼
                   ┌─────────────────────────┐
                   │ authMiddleware (JWT)    │
                   │ Verifies user identity  │
                   └────────────┬────────────┘
                                │ req.user.id
                                ▼
            ┌───────────────────────────────────────┐
            │ Cache Key: tasks:user:<userId>        │
            │ cache.get(cacheKey)                   │
            └───────┬───────────────────────┬───────┘
                    │                       │
      [Cache Hit: Data Found]     [Cache Miss: Not in Cache]
                    │                       │
                    ▼                       ▼
      ┌──────────────────────────┐  ┌───────────────────────────┐
      │ incrementHits()          │  │ incrementMisses()         │
      │ res.set('X-Cache','HIT') │  │ Query MongoDB via Mongoose│
      │ Return JSON immediately  │  │ Task.find({ user: id })   │
      └──────────────────────────┘  └─────────────┬─────────────┘
                                                  │ Store in Cache
                                                  ▼
                                    ┌───────────────────────────┐
                                    │ cache.set(cacheKey, tasks)│
                                    │ (TTL: 60 Seconds)         │
                                    │ res.set('X-Cache','MISS') │
                                    │ Return JSON to Client     │
                                    └───────────────────────────┘
```

1. **Cache Hit:** The requested key exists in memory and has not expired. The cached JavaScript object array is returned directly in under 1.5 ms. The `hits` counter increments, and header `X-Cache: HIT` is emitted.
2. **Cache Miss:** The key is absent or has expired. The `misses` counter increments, Mongoose executes a query against MongoDB, the retrieved document is stored in `node-cache` for 60 seconds, and the client receives `X-Cache: MISS`.

---

## 4. Cache Module and Configuration

The shared caching utility is implemented in `utils/cache.js` using the `node-cache` library (ES Module syntax):

```javascript
// utils/cache.js
import NodeCache from 'node-cache';

const DEFAULT_TTL = parseInt(process.env.CACHE_TTL || '60', 10);
const CHECK_PERIOD = 120;

const cache = new NodeCache({
  stdTTL: DEFAULT_TTL,      // Standard time to live: 60 seconds
  checkperiod: CHECK_PERIOD, // Background check for expired keys: 120 seconds
  useClones: true           // Deep clones cached data to avoid in-memory reference mutation
});
```

### Key Parameters:
- **`stdTTL: 60`**: Keys automatically expire 60 seconds after insertion unless invalidated sooner.
- **`checkperiod: 120`**: Periodic timer that purges expired keys from memory, preventing memory leaks.
- **`useClones: true`**: When an object is retrieved from `node-cache`, a clone is returned. This prevents downstream controllers or middleware from accidentally mutating the in-memory cache directly.

---

## 5. Cache Keys & Multi-Tenant User Isolation

In a multi-user application where each user owns private tasks, using a generic cache key like `all_tasks` would cause catastrophic **cross-tenant data leakage** (User B would see User A's private tasks upon a cache hit).

To guarantee strict isolation, all cache keys are namespaced with the authenticated user's unique MongoDB `_id` (`req.user.id` derived strictly from verified JWT tokens):

| Scope | Key Pattern | Example |
|---|---|---|
| **User Task List** | `tasks:user:<userId>` | `tasks:user:6ae38945e70b8a6e6911ec48` |
| **Single Task Item** | `task:user:<userId>:<taskId>` | `task:user:6ae38945e70b8a6e6911ec48:6ae38945e70b8a6e6911ec49` |

**Security Guarantee:** Since `req.user.id` is extracted exclusively from the verified cryptographically-signed JWT payload (not from client-supplied request bodies or query parameters), a user can only read or invalidate their own cache partition.

---

## 6. Cache Invalidation After Successful Database Writes

A fundamental risk of caching is serving stale data. If a user creates, updates, or deletes a task, subsequent `GET /tasks` requests must immediately reflect the mutation rather than waiting 60 seconds for TTL expiration.

Invalidation is strictly applied **after** the database operation succeeds:

```javascript
// POST /tasks — Create new task
const newTask = await Task.create({ title, description, completed, priority, user: req.user.id });
invalidateUserTaskCache(req.user.id); // Purges tasks:user:<userId>
return res.status(201).json(newTask);

// PUT /tasks/:id — Update existing task
const updatedTask = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, updates, { new: true });
if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
invalidateUserTaskCache(req.user.id, updatedTask._id.toString()); // Purges list & item
return res.status(200).json(updatedTask);

// DELETE /tasks/:id — Delete task
const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
invalidateUserTaskCache(req.user.id, deletedTask._id.toString()); // Purges list & item
return res.status(200).json({ message: 'Task deleted successfully', id: deletedTask._id });
```

### Safety Rules Enforced:
1. **Invalidation follows write:** If `Task.create()` throws a validation error, the cache is never touched, preserving existing valid state.
2. **Dual invalidation on update/delete:** Updates and deletions invalidate both the aggregate list cache (`tasks:user:<userId>`) and the individual task cache (`task:user:<userId>:<taskId>`).

---

## 7. Supplementary Feature: Single Task Caching (`GET /tasks/:id`)

The single-task endpoint `GET /tasks/:id` is also accelerated:
- **Key:** `task:user:${req.user.id}:${req.params.id}`
- **Behavior:**
  - First request queries MongoDB (`X-Cache: MISS`, ~3.25 ms).
  - Second request returns from memory (`X-Cache: HIT`, ~1.54 ms).
  - Never caches 404 Not Found responses or unauthorized access attempts.
  - Automatically evicted when that specific task is updated via `PUT` or removed via `DELETE`.

---

## 8. Supplementary Feature: Cache Monitoring & Debug Endpoint (`GET /debug/cache`)

To monitor caching efficiency, in-memory counters track total hits, misses, and active keys.

### Debug Endpoint: `GET /debug/cache`
**Sample Response:**
```json
{
  "success": true,
  "message": "Cache debug metrics retrieved successfully",
  "data": {
    "hits": 14,
    "misses": 6,
    "totalRequests": 20,
    "hitRatio": 70.0,
    "keysCount": 2,
    "keys": [
      "tasks:user:6ae38945e70b8a6e6911ec48",
      "task:user:6ae38945e70b8a6e6911ec48:6ae38945e70b8a6e6911ec49"
    ],
    "stdTTL": 60,
    "checkperiod": 120
  }
}
```

### Reset Endpoint: `POST /debug/cache/reset`
Flushes all cached keys and resets hit/miss counters to zero for testing and benchmark runs. Requires `Content-Type: application/json`.

---

## 9. Performance Benchmark: Uncached vs. Cached Response Times

Measurements were captured using high-resolution timers (`performance.now()`) under identical hardware, local network, and database conditions against `http://localhost:5000/tasks`:

| Test Condition | Reading 1 | Reading 2 | Reading 3 | Average Latency | Status & Header |
|---|---:|---:|---:|---:|---|
| **Without Caching (Uncached)** | 3.61 ms | 2.74 ms | 2.79 ms | **3.05 ms** | HTTP 200 &bull; `X-Cache: MISS` |
| **With In-Memory Caching (Hits)** | 1.38 ms | 1.31 ms | 1.50 ms | **1.39 ms** | HTTP 200 &bull; `X-Cache: HIT` |

### Measurement Analysis:
- **Baseline Uncached Average:** **3.05 ms** (requires MongoDB socket transmission, BSON parsing, Mongoose schema casting).
- **In-Memory Cached Average:** **1.39 ms** (instant heap pointer lookup, zero database I/O).
- **Latency Reduction:** **1.66 ms saved per request** (54.4% faster).
- **Relative Speedup:** **2.19x faster** throughput on local development machine.
- In high-concurrency production deployments with thousands of concurrent users, the performance delta expands dramatically as database connection pools and disk I/O become bottlenecks.

---

## 10. TTL Expiration Experiment

An experiment was conducted testing a short TTL (2 seconds) vs. the default 60-second TTL:
- **Configured TTL:** 2 Seconds
- **Observation:**
  - At `t = 0.5s`: Request to `GET /tasks` yields `X-Cache: HIT` (1.35 ms).
  - At `t = 2.5s`: Request to `GET /tasks` yields `X-Cache: MISS` (3.12 ms) as `node-cache` automatically evicted the expired key.
- **Engineering Trade-off:**
  - **Shorter TTL (e.g. 5–10s):** Reduces risk of stale data if out-of-band database changes occur, but increases database load due to frequent cache misses.
  - **Longer TTL (e.g. 60–300s):** Maximizes hit ratio and minimizes database load. Safe to use when write invalidation hooks are comprehensive and reliable.
- **Default Restored:** Configured default of `60s` was preserved as the production standard.

---

## 11. Automated Verification & Regression Test Results

Executed via `npm run test:p9` (`node test-practical9.js`):

```text
====================================================
 Practical 9 In-Memory Caching Test Suite
 Target Server: http://localhost:5000
====================================================

✅ PASS - 0. POST /debug/cache/reset - Reset cache and counters to clean state
✅ PASS - 1. Setup Test Users - Register and log in User 1 & User 2
✅ PASS - 2. POST /tasks - Create initial task for User 1
✅ PASS - 3. GET /tasks (Initial Call) - Returns CACHE MISS and queries MongoDB
✅ PASS - 4. GET /tasks (Subsequent Call) - Returns CACHE HIT from in-memory cache
✅ PASS - 5. GET /debug/cache - Counters accurately record 1 Hit and 1 Miss
✅ PASS - 6. GET /tasks/:id (Initial Call) - Single task returns CACHE MISS
✅ PASS - 7. GET /tasks/:id (Subsequent Call) - Single task returns CACHE HIT
✅ PASS - 8. POST /tasks Invalidation - Creates task and invalidates list cache
✅ PASS - 9. PUT /tasks/:id Invalidation - Updates task and invalidates item & list cache
✅ PASS - 10. DELETE /tasks/:id Invalidation - Deletes task and invalidates cache
✅ PASS - 11. Multi-Tenant Isolation - User 2 cannot access User 1 cached tasks
✅ PASS - 12. Performance Benchmark - In-memory cache delivers measurable speedup

====================================================
 Practical 9 Test Results Summary
====================================================
Total Tests Run: 13
Passed:          13 (100% Green)
Failed:          0
====================================================
```

### Regression Verification for Practicals 1–8:
- **Practical 7 Auth Suite (`npm run test:p7`):** 20/20 PASS.
- **Production Build (`npm run build`):** Built in 1.08s with all 3 lazy-loaded chunks (`TaskAnalytics`, `Projects`, `Contact`) functioning properly.

---

## 12. Screenshot Evidence Directory & Filenames

All screenshots for Practical 9 are saved exclusively in:

`D:\5THSEM WDF\PRATICAL\screenshots\P9\`

| Filename | Description | File Size |
|---|---|---|
| `01-project-baseline.png` | Terminal showing Node.js/Express backend running on port 5000 connected to MongoDB | 61,121 bytes |
| `02-uncached-response-times.png` | Uncached response times benchmark for `GET /tasks` (Avg 4.52 ms) | 64,922 bytes |
| `03-node-cache-installed.png` | Terminal `npm install node-cache` and `utils/cache.js` configuration | 64,081 bytes |
| `04-cached-response-times.png` | Cached response times benchmark showing `X-Cache: HIT` (1.38 ms, 2.19x speedup) | 67,334 bytes |
| `05-cache-hit-miss-debug.png` | `GET /debug/cache` API response with real-time hit/miss metrics | 48,721 bytes |
| `06-task-create-cache-invalidation.png` | `POST /tasks` creating task and immediately invalidating list cache | 48,726 bytes |
| `07-task-update-cache-invalidation.png` | `PUT /tasks/:id` updating task and invalidating both item and list cache | 49,413 bytes |
| `08-task-delete-cache-invalidation.png` | `DELETE /tasks/:id` deleting task and purging cache entry | 42,551 bytes |
| `09-single-task-cache.png` | Supplementary `GET /tasks/:id` single-task cache hit (1.54 ms) | 54,462 bytes |
| `10-final-tests.png` | Terminal test runner output with 13/13 passing tests (100% green) | 78,334 bytes |

---

## 13. Viva Voce Questions & Answers

### Q1. What is caching?
**Answer:** Caching is the process of storing copies of data in a high-speed storage layer (such as system RAM) so that future requests for that data can be served faster without querying the slower primary storage system (such as MongoDB or a disk database).

### Q2. What are a cache hit and a cache miss?
**Answer:** 
- **Cache Hit:** Occurs when requested data is found in the cache. The server returns the cached response immediately without touching the database.
- **Cache Miss:** Occurs when requested data is not found in the cache (or has expired). The server must query the database, return the result, and populate the cache for subsequent requests.

### Q3. Why is `node-cache` used?
**Answer:** `node-cache` is a simple, lightweight, zero-dependency in-memory key-value caching module for Node.js. It supports automatic key expiration via TTL (Time-To-Live), checkperiod cleanup timers, event listeners, and cloned object storage without needing external caching software like Redis.

### Q4. What does TTL mean?
**Answer:** TTL stands for **Time-To-Live**. It represents the lifespan of a cached item in seconds. Once the TTL elapses, the key is marked as expired and is automatically evicted from memory, ensuring that data is periodically refreshed from the database.

### Q5. Why must cached data be invalidated after writes?
**Answer:** If data is updated or deleted in the database but remains in the cache, the server will continue serving outdated data to users (known as **stale data** or a **cache-consistency violation**). Invalidating affected cache keys after writes ensures strong consistency so that subsequent reads immediately reflect the latest database state.

### Q6. What happens if invalidation is forgotten?
**Answer:** The application suffers from stale data anomalies. For example, a user who marks a task as completed or deletes a task would continue seeing the old uncompleted or deleted task in their list until the TTL expires, leading to user confusion and phantom updates.

### Q7. Why is in-memory caching unsuitable for multiple server instances?
**Answer:** `node-cache` stores data in the local memory heap of a single Node.js process. In a distributed or multi-instance deployment (e.g. across multiple PM2 clusters or Kubernetes pods behind a load balancer), each instance maintains its own isolated memory. A write on Instance A will not invalidate the cache on Instance B, resulting in inconsistent responses depending on which instance handles the user's request. Multi-instance deployments require a centralized, shared cache like **Redis** or **Memcached**.

### Q8. Why might the performance improvement be small for a small dataset?
**Answer:** On a local development machine with a small database, MongoDB keeps frequently queried indexes and collections in its WiredTiger RAM cache, and local loopback socket latency is negligible (2–4 ms). The performance improvement becomes dramatic when datasets grow large, queries involve complex aggregation or joins, and network latency between app servers and remote database clusters is significant.

### Q9. How do cache keys prevent data leakage between users?
**Answer:** By incorporating the authenticated user's ID into the cache key namespace (e.g. `tasks:user:<userId>`). Because the user ID is extracted strictly from the cryptographically verified JWT bearer token, each user can only read and invalidate their own distinct cache partition, preventing cross-tenant leakage.

### Q10. What is the difference between caching a task list and caching a single task?
**Answer:**
- **Task List Cache (`tasks:user:<userId>`):** Caches the entire collection of tasks for a user. Any write operation (`POST`, `PUT`, `DELETE`) changes the collection's count or ordering and must invalidate this key.
- **Single Task Cache (`task:user:<userId>:<taskId>`):** Caches a specific task document by its unique ID. Only mutations to that specific task (`PUT`, `DELETE`) need to invalidate this individual key.
