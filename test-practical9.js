/**
// =============================================================================
// Practical 9: In-Memory Caching and Query Optimization
// File: test-practical9.js
// Description: Automated Test Suite verifying node-cache in-memory caching,
//              cache hit/miss counters, post-write invalidation, user isolation,
//              single-task caching, and response time benchmarking.
// =============================================================================
 */

import { performance } from 'perf_hooks';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000';
const results = [];

function recordResult(testName, passed, details) {
  results.push({ testName, passed, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} - ${testName}`);
  if (details) {
    console.log(`    Details: ${details}`);
  }
}

async function runPractical9Tests() {
  console.log('====================================================');
  console.log(' Starting Practical 9 In-Memory Caching Test Suite');
  console.log(` Target Server: ${BASE_URL}`);
  console.log('====================================================\n');

  const timestamp = Date.now();
  const user1Email = `cacheuser1_${timestamp}@charusat.edu.in`;
  const user1Pass = 'CacheTestPass123!';
  const user2Email = `cacheuser2_${timestamp}@charusat.edu.in`;
  const user2Pass = 'CacheTestPass456!';

  let user1Token = null;
  let user1Id = null;
  let user2Token = null;
  let user2Id = null;
  let createdTaskId = null;

  try {
    // 0. Reset cache to clean baseline
    {
      const resetRes = await fetch(`${BASE_URL}/debug/cache/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const resetData = await resetRes.json();
      recordResult(
        '0. POST /debug/cache/reset - Reset cache and counters to clean state',
        resetRes.status === 200 && resetData.success === true,
        `Hits: ${resetData.data.hits}, Misses: ${resetData.data.misses}, Keys: ${resetData.data.keysCount}`
      );
    }

    // 1. Setup User 1 and User 2
    {
      const reg1 = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user1Email, password: user1Pass })
      });
      const data1 = await reg1.json();
      user1Id = data1.user.id;

      const log1 = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user1Email, password: user1Pass })
      });
      const logData1 = await log1.json();
      user1Token = logData1.token;

      const reg2 = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user2Email, password: user2Pass })
      });
      const data2 = await reg2.json();
      user2Id = data2.user.id;

      const log2 = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user2Email, password: user2Pass })
      });
      const logData2 = await log2.json();
      user2Token = logData2.token;

      recordResult(
        '1. Setup Test Users - Register and log in User 1 & User 2',
        user1Token && user2Token,
        `User 1 ID: ${user1Id}, User 2 ID: ${user2Id}`
      );
    }

    // 2. Populate initial task for User 1
    {
      const taskRes = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user1Token}`
        },
        body: JSON.stringify({
          title: 'Practical 9 Caching Architecture Task',
          description: 'Benchmark in-memory node-cache vs MongoDB query latency',
          priority: 'high'
        })
      });
      const taskData = await taskRes.json();
      createdTaskId = taskData._id;

      recordResult(
        '2. POST /tasks - Create initial task for User 1',
        taskRes.status === 201 && createdTaskId,
        `Task ID: ${createdTaskId}, Title: "${taskData.title}"`
      );
    }

    // 3. First GET /tasks -> CACHE MISS (X-Cache: MISS)
    {
      const start = performance.now();
      const res = await fetch(`${BASE_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${user1Token}` }
      });
      const duration = performance.now() - start;
      const tasks = await res.json();
      const xCache = res.headers.get('x-cache');

      recordResult(
        '3. GET /tasks (Initial Call) - Returns CACHE MISS and queries MongoDB',
        res.status === 200 && xCache === 'MISS' && tasks.length === 1,
        `Status: ${res.status}, X-Cache: ${xCache}, Duration: ${duration.toFixed(2)} ms, Tasks: ${tasks.length}`
      );
    }

    // 4. Second GET /tasks -> CACHE HIT (X-Cache: HIT)
    {
      const start = performance.now();
      const res = await fetch(`${BASE_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${user1Token}` }
      });
      const duration = performance.now() - start;
      const tasks = await res.json();
      const xCache = res.headers.get('x-cache');

      recordResult(
        '4. GET /tasks (Subsequent Call) - Returns CACHE HIT from in-memory cache',
        res.status === 200 && xCache === 'HIT' && tasks.length === 1,
        `Status: ${res.status}, X-Cache: ${xCache}, Duration: ${duration.toFixed(2)} ms, Tasks: ${tasks.length}`
      );
    }

    // 5. Verify /debug/cache reflects 1 hit and 1 miss
    {
      const debugRes = await fetch(`${BASE_URL}/debug/cache`);
      const debugData = await debugRes.json();
      const { hits, misses, keysCount } = debugData.data;

      recordResult(
        '5. GET /debug/cache - Counters accurately record 1 Hit and 1 Miss',
        hits >= 1 && misses >= 1 && keysCount >= 1,
        `Hits: ${hits}, Misses: ${misses}, Keys Count: ${keysCount}, TTL: ${debugData.data.stdTTL}s`
      );
    }

    // 6. Supplementary: GET /tasks/:id initial call -> CACHE MISS
    {
      const start = performance.now();
      const res = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
        headers: { 'Authorization': `Bearer ${user1Token}` }
      });
      const duration = performance.now() - start;
      const task = await res.json();
      const xCache = res.headers.get('x-cache');

      recordResult(
        '6. GET /tasks/:id (Initial Call) - Single task returns CACHE MISS',
        res.status === 200 && xCache === 'MISS' && task._id === createdTaskId,
        `Status: ${res.status}, X-Cache: ${xCache}, Duration: ${duration.toFixed(2)} ms, Title: "${task.title}"`
      );
    }

    // 7. Supplementary: GET /tasks/:id subsequent call -> CACHE HIT
    {
      const start = performance.now();
      const res = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
        headers: { 'Authorization': `Bearer ${user1Token}` }
      });
      const duration = performance.now() - start;
      const task = await res.json();
      const xCache = res.headers.get('x-cache');

      recordResult(
        '7. GET /tasks/:id (Subsequent Call) - Single task returns CACHE HIT',
        res.status === 200 && xCache === 'HIT' && task._id === createdTaskId,
        `Status: ${res.status}, X-Cache: ${xCache}, Duration: ${duration.toFixed(2)} ms`
      );
    }

    // 8. Invalidation on POST /tasks: creating Task 2 must invalidate list cache
    {
      const createRes = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user1Token}`
        },
        body: JSON.stringify({
          title: 'Second Task to trigger Invalidation',
          priority: 'medium'
        })
      });
      const createData = await createRes.json();

      // Immediately fetch GET /tasks - must be a CACHE MISS and return 2 tasks!
      const listRes = await fetch(`${BASE_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${user1Token}` }
      });
      const listTasks = await listRes.json();
      const listXCache = listRes.headers.get('x-cache');

      recordResult(
        '8. POST /tasks Invalidation - Creates task and invalidates list cache',
        createRes.status === 201 && listXCache === 'MISS' && listTasks.length === 2,
        `Created ID: ${createData._id}, Next GET X-Cache: ${listXCache}, List Count: ${listTasks.length}`
      );
    }

    // 9. Invalidation on PUT /tasks/:id: updating Task 1 must invalidate list & single item cache
    {
      const updateRes = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user1Token}`
        },
        body: JSON.stringify({
          title: 'Updated Practical 9 Task Title',
          completed: true
        })
      });
      const updateData = await updateRes.json();

      // Immediately fetch GET /tasks/:id - must be a CACHE MISS with new title
      const itemRes = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
        headers: { 'Authorization': `Bearer ${user1Token}` }
      });
      const itemData = await itemRes.json();
      const itemXCache = itemRes.headers.get('x-cache');

      recordResult(
        '9. PUT /tasks/:id Invalidation - Updates task and invalidates item & list cache',
        updateRes.status === 200 &&
          itemXCache === 'MISS' &&
          itemData.title === 'Updated Practical 9 Task Title' &&
          itemData.completed === true,
        `Updated Title: "${itemData.title}", Completed: ${itemData.completed}, Next GET X-Cache: ${itemXCache}`
      );
    }

    // 10. Invalidation on DELETE /tasks/:id: deleting Task 1 must invalidate cache
    {
      const delRes = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user1Token}` }
      });
      const delData = await delRes.json();

      // Immediately fetch GET /tasks - must be a CACHE MISS with 1 remaining task
      const listRes = await fetch(`${BASE_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${user1Token}` }
      });
      const listTasks = await listRes.json();
      const listXCache = listRes.headers.get('x-cache');

      recordResult(
        '10. DELETE /tasks/:id Invalidation - Deletes task and invalidates cache',
        delRes.status === 200 && listXCache === 'MISS' && listTasks.length === 1,
        `Deleted ID: ${delData.id}, Next GET X-Cache: ${listXCache}, Remaining Count: ${listTasks.length}`
      );
    }

    // 11. Multi-Tenant User Isolation: User 2 cannot access User 1 cached data
    {
      // First populate User 1's cache
      await fetch(`${BASE_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${user1Token}` }
      });

      // User 2 requests GET /tasks - must see only User 2's tasks (0 tasks)
      const user2Res = await fetch(`${BASE_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${user2Token}` }
      });
      const user2Tasks = await user2Res.json();
      const user2XCache = user2Res.headers.get('x-cache');

      recordResult(
        '11. Multi-Tenant Isolation - User 2 cannot access User 1 cached tasks',
        user2Res.status === 200 && user2Tasks.length === 0 && user2XCache === 'MISS',
        `User 2 Tasks Count: ${user2Tasks.length}, User 2 X-Cache: ${user2XCache} (No cross-tenant leak)`
      );
    }

    // 12. Response Time Benchmark Comparison (Uncached vs. Cached Hits)
    {
      console.log('\n--- Running Fair Response-Time Benchmark (3 Uncached vs. 3 Cached Hits) ---');

      // Uncached baseline: Flush cache before each request to force MongoDB queries
      const uncachedTimings = [];
      for (let i = 1; i <= 3; i++) {
        await fetch(`${BASE_URL}/debug/cache/reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const start = performance.now();
        const res = await fetch(`${BASE_URL}/tasks`, {
          headers: { 'Authorization': `Bearer ${user1Token}` }
        });
        const duration = performance.now() - start;
        await res.json();
        uncachedTimings.push(duration);
        console.log(`  Uncached Reading ${i}: ${duration.toFixed(2)} ms (X-Cache: ${res.headers.get('x-cache')})`);
      }

      // Cached benchmark: First request primes the cache (MISS), next 3 are HITS
      await fetch(`${BASE_URL}/debug/cache/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      // Prime cache
      const primeRes = await fetch(`${BASE_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${user1Token}` }
      });
      await primeRes.json();

      const cachedTimings = [];
      for (let i = 1; i <= 3; i++) {
        const start = performance.now();
        const res = await fetch(`${BASE_URL}/tasks`, {
          headers: { 'Authorization': `Bearer ${user1Token}` }
        });
        const duration = performance.now() - start;
        await res.json();
        cachedTimings.push(duration);
        console.log(`  Cached Reading ${i}: ${duration.toFixed(2)} ms (X-Cache: ${res.headers.get('x-cache')})`);
      }

      const avgUncached = uncachedTimings.reduce((a, b) => a + b, 0) / uncachedTimings.length;
      const avgCached = cachedTimings.reduce((a, b) => a + b, 0) / cachedTimings.length;
      const speedup = (avgUncached / avgCached).toFixed(2);

      recordResult(
        '12. Performance Benchmark - In-memory cache delivers measurable speedup',
        avgCached < avgUncached,
        `Avg Uncached: ${avgUncached.toFixed(2)} ms, Avg Cached: ${avgCached.toFixed(2)} ms (${speedup}x speedup)`
      );
    }

    console.log('\n====================================================');
    console.log(' Practical 9 Test Results Summary');
    console.log('====================================================');
    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed).length;
    console.log(`Total Tests Run: ${results.length}`);
    console.log(`Passed:          ${passed}`);
    console.log(`Failed:          ${failed}`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Fatal test error:', err);
  }
}

runPractical9Tests();
