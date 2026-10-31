// =============================================================================
// Practical 10: Asynchronous Processing with Event-Driven Architecture
// File: test-practical10.js
// Description: Automated Test Suite verifying Node.js EventEmitter,
//              asynchronous background notification listener, setImmediate scheduling,
//              API response vs handler timestamps, invalid write suppression,
//              unauthorized request rejection, and multi-task event dispatching.
// =============================================================================

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

async function runPractical10Tests() {
  console.log('====================================================');
  console.log(' Starting Practical 10 Asynchronous Event-Driven Test Suite');
  console.log(` Target Server: ${BASE_URL}`);
  console.log('====================================================\n');

  const timestamp = Date.now();
  const testEmail = `eventuser_${timestamp}@charusat.edu.in`;
  const testPassword = 'EventPassword123!';
  let authToken = null;
  let testUserId = null;

  try {
    // 0. Reset notification history for test isolation
    {
      const resetRes = await fetch(`${BASE_URL}/debug/notifications/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const resetData = await resetRes.json();
      recordResult(
        '0. POST /debug/notifications/reset - Clean event history baseline',
        resetRes.status === 200 && resetData.success === true,
        `Count: ${resetData.count}`
      );
    }

    // 1. Authenticate user
    {
      const regRes = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: testPassword })
      });
      const regData = await regRes.json();
      testUserId = regData.user.id;

      const loginRes = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: testPassword })
      });
      const loginData = await loginRes.json();
      authToken = loginData.token;

      recordResult(
        '1. Authentication - Register and login user for Practical 10 tests',
        Boolean(authToken && testUserId),
        `User ID: ${testUserId}, Email: ${testEmail}`
      );
    }

    // 2. Test 1: POST /tasks creates task and returns HTTP 201 immediately
    let task1Id = null;
    let task1ApiTime = null;
    {
      const start = performance.now();
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: 'Implement Node.js EventEmitter',
          description: 'Decoupled in-process event emission for background jobs',
          priority: 'high'
        })
      });
      const duration = performance.now() - start;
      const data = await res.json();
      task1Id = data._id;

      recordResult(
        '2. POST /tasks - Create task and return immediate HTTP 201 response',
        res.status === 201 && task1Id,
        `Task ID: ${task1Id}, Title: "${data.title}", HTTP Response Time: ${duration.toFixed(2)} ms`
      );
    }

    // 3. Test 2: Verify background listener received and processed the event
    {
      // Allow setImmediate event loop turn to execute
      await new Promise((r) => setTimeout(r, 60));

      const debugRes = await fetch(`${BASE_URL}/debug/notifications`);
      const debugData = await debugRes.json();
      const notification = debugData.data.find((n) => n.taskId === task1Id);

      const isValid = Boolean(
        notification &&
        notification.taskId === task1Id &&
        notification.title === 'Implement Node.js EventEmitter' &&
        notification.userId === testUserId &&
        notification.apiTimestamp &&
        notification.handlerTimestamp
      );

      task1ApiTime = notification?.apiTimestamp;
      recordResult(
        '3. Background Notification Listener - Event processed asynchronously via setImmediate()',
        isValid,
        `Task ID: ${notification?.taskId}, Title: "${notification?.title}", Assigned User: ${notification?.userEmail}`
      );
    }

    // 4. Test 3: Demonstrate API response timestamp vs background handler timestamp
    {
      const debugRes = await fetch(`${BASE_URL}/debug/notifications`);
      const debugData = await debugRes.json();
      const notification = debugData.data.find((n) => n.taskId === task1Id);

      const apiTime = new Date(notification.apiTimestamp).getTime();
      const handlerTime = new Date(notification.handlerTimestamp).getTime();
      const executionDiff = handlerTime - apiTime;

      recordResult(
        '4. Timestamp Verification - Both API response and Handler timestamps logged',
        Boolean(notification.apiTimestamp && notification.handlerTimestamp && handlerTime >= apiTime),
        `API Timestamp: ${notification.apiTimestamp} | Handler Timestamp: ${notification.handlerTimestamp} (Execution Delta: ${executionDiff} ms)`
      );
    }

    // 5. Test 4: Create multiple tasks and verify individual event dispatching
    {
      const task2Res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: 'Second Task for Multi-Event Verification',
          description: 'Testing separate event emissions across tasks',
          priority: 'medium'
        })
      });
      const task2 = await task2Res.json();

      const task3Res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: 'Third Task for Multi-Event Verification',
          description: 'Testing event listener concurrency',
          priority: 'low'
        })
      });
      const task3 = await task3Res.json();

      // Allow event loop ticks
      await new Promise((r) => setTimeout(r, 60));

      const debugRes = await fetch(`${BASE_URL}/debug/notifications`);
      const debugData = await debugRes.json();

      const hasTask2 = debugData.data.some((n) => n.taskId === task2._id);
      const hasTask3 = debugData.data.some((n) => n.taskId === task3._id);

      recordResult(
        '5. Multiple Tasks - Each successful task creation emits its own distinct event',
        task2Res.status === 201 && task3Res.status === 201 && hasTask2 && hasTask3,
        `Total Notifications Logged: ${debugData.count} (Task 2 ID: ${task2._id}, Task 3 ID: ${task3._id})`
      );
    }

    // 6. Test 5: Failed task creation does NOT emit an event (Input Validation)
    {
      const initialCountRes = await fetch(`${BASE_URL}/debug/notifications`);
      const initialCountData = await initialCountRes.json();
      const countBefore = initialCountData.count;

      // Send request with empty title
      const failRes = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: '   ', // Whitespace only
          description: 'This must fail validation'
        })
      });
      const failData = await failRes.json();

      await new Promise((r) => setTimeout(r, 60));

      const finalCountRes = await fetch(`${BASE_URL}/debug/notifications`);
      const finalCountData = await finalCountRes.json();
      const countAfter = finalCountData.count;

      recordResult(
        '6. Validation Failure - Invalid task creation does NOT emit task-created event',
        failRes.status === 400 && countBefore === countAfter,
        `Status: ${failRes.status}, Error: "${failData.error}", Notifications Before: ${countBefore}, After: ${countAfter}`
      );
    }

    // 7. Test 6: Unauthorized request does NOT emit an event (Auth Middleware)
    {
      const initialCountRes = await fetch(`${BASE_URL}/debug/notifications`);
      const initialCountData = await initialCountRes.json();
      const countBefore = initialCountData.count;

      // Send request without Bearer token
      const unauthRes = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Unauthorized Task Test',
          description: 'This must be rejected by authMiddleware'
        })
      });
      const unauthData = await unauthRes.json();

      await new Promise((r) => setTimeout(r, 60));

      const finalCountRes = await fetch(`${BASE_URL}/debug/notifications`);
      const finalCountData = await finalCountRes.json();
      const countAfter = finalCountData.count;

      recordResult(
        '7. Authentication Security - Unauthorized request rejected (401) with zero event emission',
        unauthRes.status === 401 && countBefore === countAfter,
        `Status: ${unauthRes.status}, Error: "${unauthData.error}", Notifications Before: ${countBefore}, After: ${countAfter}`
      );
    }

    // 8. Test 7: Verify zero regression on existing CRUD endpoints (GET, PUT, DELETE)
    {
      // GET /tasks
      const listRes = await fetch(`${BASE_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const listData = await listRes.json();

      // PUT /tasks/:id
      const putRes = await fetch(`${BASE_URL}/tasks/${task1Id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ completed: true })
      });
      const putData = await putRes.json();

      // DELETE /tasks/:id
      const delRes = await fetch(`${BASE_URL}/tasks/${task1Id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const delData = await delRes.json();

      recordResult(
        '8. Regression Suite - Existing GET, PUT, DELETE endpoints function correctly',
        listRes.status === 200 && putRes.status === 200 && delRes.status === 200 && putData.completed === true,
        `List Count: ${listData.length}, Updated Completed: ${putData.completed}, Deleted ID: ${delData.id}`
      );
    }

    console.log('\n====================================================');
    console.log(' Practical 10 Test Results Summary');
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

runPractical10Tests();
