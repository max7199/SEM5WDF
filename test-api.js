/**
 * Automated Test Suite for Practical 4: RESTful Task Management API
 * Tests all endpoints, status codes (200, 201, 400, 404, 415, 500), and middleware.
 */

const BASE_URL = 'http://localhost:5000';

const results = [];

function recordResult(testName, passed, details) {
  results.push({ testName, passed, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} - ${testName}`);
  if (!passed || details) {
    console.log(`    Details: ${details}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log(' Starting Practical 4 API Automated Test Suite');
  console.log(` Target Server: ${BASE_URL}`);
  console.log('====================================================\n');

  try {
    // ----------------------------------------------------------------
    // Test 1: Fetch all tasks (GET /tasks) -> Status 200
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks`);
      const data = await res.json();
      const passed = res.status === 200 && data.success === true && Array.isArray(data.data) && data.data.length > 0;
      recordResult(
        '1. GET /tasks - Fetch all tasks (Status 200)',
        passed,
        `HTTP ${res.status}, Count: ${data.data?.length}`
      );
    }

    // ----------------------------------------------------------------
    // Test 2: Create a task with valid JSON (POST /tasks) -> Status 201
    // ----------------------------------------------------------------
    let createdTaskId = null;
    {
      const payload = {
        title: 'Submit WDF Practical Assignment',
        description: 'Verify all 4 CRUD endpoints and middleware',
        completed: false
      };
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const passed = res.status === 201 && data.success === true && data.data?.title === payload.title;
      if (passed) createdTaskId = data.data.id;
      recordResult(
        '2. POST /tasks - Create task with valid JSON (Status 201)',
        passed,
        `HTTP ${res.status}, Assigned Task ID: ${createdTaskId}`
      );
    }

    // ----------------------------------------------------------------
    // Test 3: Update an existing task (PUT /tasks/:id) -> Status 200
    // ----------------------------------------------------------------
    {
      const targetId = createdTaskId || 1;
      const updatePayload = {
        title: 'Submit WDF Practical Assignment - Completed',
        completed: true
      };
      const res = await fetch(`${BASE_URL}/tasks/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });
      const data = await res.json();
      const passed = res.status === 200 && data.success === true && data.data?.completed === true;
      recordResult(
        `3. PUT /tasks/${targetId} - Update existing task (Status 200)`,
        passed,
        `HTTP ${res.status}, Completed: ${data.data?.completed}`
      );
    }

    // ----------------------------------------------------------------
    // Test 4: Delete an existing task (DELETE /tasks/:id) -> Status 200
    // ----------------------------------------------------------------
    {
      const targetId = createdTaskId || 1;
      const res = await fetch(`${BASE_URL}/tasks/${targetId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      const passed = res.status === 200 && data.success === true && data.data?.id === targetId;
      recordResult(
        `4. DELETE /tasks/${targetId} - Delete existing task (Status 200)`,
        passed,
        `HTTP ${res.status}, Deleted Task ID: ${data.data?.id}`
      );
    }

    // ----------------------------------------------------------------
    // Test 5: Request a task ID that does not exist -> Status 404
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks/99999`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Non-existent task' })
      });
      const data = await res.json();
      const passed = res.status === 404 && data.success === false;
      recordResult(
        '5. PUT /tasks/99999 - Non-existent task ID (Status 404)',
        passed,
        `HTTP ${res.status}, Error: "${data.error}"`
      );
    }

    // ----------------------------------------------------------------
    // Test 6: Request with invalid task ID format -> Status 400
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks/abc-invalid`, {
        method: 'DELETE'
      });
      const data = await res.json();
      const passed = res.status === 400 && data.success === false;
      recordResult(
        '6. DELETE /tasks/abc-invalid - Invalid ID format (Status 400)',
        passed,
        `HTTP ${res.status}, Error: "${data.error}"`
      );
    }

    // ----------------------------------------------------------------
    // Test 7: Send POST without Content-Type: application/json -> Status 415
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: 'title=Plain+Text+Task'
      });
      const data = await res.json();
      const passed = res.status === 415 && data.success === false;
      recordResult(
        '7. POST /tasks without JSON Content-Type (Status 415)',
        passed,
        `HTTP ${res.status}, Error: "${data.error}"`
      );
    }

    // ----------------------------------------------------------------
    // Test 8: Send PUT without Content-Type: application/json -> Status 415
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks/1`, {
        method: 'PUT',
        // Omitting Content-Type header
        body: 'plain-text-payload'
      });
      const data = await res.json();
      const passed = res.status === 415 && data.success === false;
      recordResult(
        '8. PUT /tasks/1 without JSON Content-Type (Status 415)',
        passed,
        `HTTP ${res.status}, Error: "${data.error}"`
      );
    }

    // ----------------------------------------------------------------
    // Test 9: Send POST with invalid task data (missing title) -> Status 400
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'No title provided' })
      });
      const data = await res.json();
      const passed = res.status === 400 && data.success === false;
      recordResult(
        '9. POST /tasks with missing title validation (Status 400)',
        passed,
        `HTTP ${res.status}, Error: "${data.error}"`
      );
    }

    // ----------------------------------------------------------------
    // Test 10: Send malformed JSON payload -> Status 400 (caught by errorHandler)
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{ "title": "Malformed JSON' // missing closing brace
      });
      const data = await res.json();
      const passed = res.status === 400 && data.success === false;
      recordResult(
        '10. POST /tasks with malformed JSON syntax (Status 400)',
        passed,
        `HTTP ${res.status}, Error: "${data.error}"`
      );
    }

    // ----------------------------------------------------------------
    // Test 11: Request an undefined route -> Status 404 Custom Handler
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/api/non-existent-endpoint`);
      const data = await res.json();
      const passed = res.status === 404 && data.success === false;
      recordResult(
        '11. GET /api/non-existent-endpoint - Custom 404 Handler (Status 404)',
        passed,
        `HTTP ${res.status}, Error: "${data.error}"`
      );
    }

    // ----------------------------------------------------------------
    // Test 12: Internal error handling (GET /simulate-error) -> Status 500
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/simulate-error`);
      const data = await res.json();
      const passed = res.status === 500 && data.success === false && !data.stack;
      recordResult(
        '12. GET /simulate-error - Global Error Handler without stack leak (Status 500)',
        passed,
        `HTTP ${res.status}, Error: "${data.error}"`
      );
    }

    console.log('\n====================================================');
    const totalPassed = results.filter((r) => r.passed).length;
    console.log(` Summary: ${totalPassed} / ${results.length} tests passed.`);
    console.log('====================================================\n');

    if (totalPassed === results.length) {
      console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
    } else {
      console.error('❌ SOME TESTS FAILED.');
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('Test execution failed with error:', err.message);
    process.exitCode = 1;
  }
}

runTests();
