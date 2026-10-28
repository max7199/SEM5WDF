/**
 * Automated Test Suite for Practical 5: MongoDB Integration and Schema Design with Mongoose
 * Student: Max Patel (24IT070) - CHARUSAT - ITUE301
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
  console.log(' Starting Practical 5 MongoDB API Automated Test Suite');
  console.log(` Target Server: ${BASE_URL}`);
  console.log('====================================================\n');

  try {
    // ----------------------------------------------------------------
    // Test 1: Fetch all tasks (GET /tasks) -> Status 200
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks`);
      const data = await res.json();
      const passed = res.status === 200 && Array.isArray(data);
      recordResult(
        '1. GET /tasks - Fetch all tasks from MongoDB (Status 200)',
        passed,
        `HTTP ${res.status}, Existing Tasks Count: ${data.length}`
      );
    }

    // ----------------------------------------------------------------
    // Test 2: Create a task with valid data and default values (POST /tasks) -> Status 201
    // ----------------------------------------------------------------
    let createdTaskId = null;
    {
      const payload = {
        title: 'Complete Practical 5 Mongoose Integration',
        description: 'Connect Express to MongoDB and test CRUD'
        // omitted priority, completed, createdAt -> test defaults
      };
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const passed =
        res.status === 201 &&
        data._id &&
        data.title === payload.title &&
        data.description === payload.description &&
        data.completed === false &&
        data.priority === 'medium';

      if (passed) createdTaskId = data._id;

      recordResult(
        '2. POST /tasks - Create valid task with schema defaults (Status 201)',
        passed,
        `HTTP ${res.status}, MongoDB ID: ${createdTaskId}, Priority: ${data.priority}, Completed: ${data.completed}`
      );
    }

    // ----------------------------------------------------------------
    // Test 3: Title whitespace trimming via pre-save hook (POST /tasks) -> Status 201
    // ----------------------------------------------------------------
    let trimmedTaskId = null;
    {
      const untrimmedTitle = '   Trimmed Title With Surrounding Spaces   ';
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: untrimmedTitle,
          priority: 'high'
        })
      });
      const data = await res.json();
      const passed = res.status === 201 && data.title === 'Trimmed Title With Surrounding Spaces';
      if (passed) trimmedTaskId = data._id;
      recordResult(
        '3. POST /tasks - Pre-save hook whitespace trimming (Status 201)',
        passed,
        `HTTP ${res.status}, Stored Title: "${data.title}"`
      );
    }

    // ----------------------------------------------------------------
    // Test 4: Retrieve single task by ID (GET /tasks/:id) -> Status 200
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks/${createdTaskId}`);
      const data = await res.json();
      const passed = res.status === 200 && data._id === createdTaskId;
      recordResult(
        `4. GET /tasks/:id - Retrieve single task by MongoDB ID (Status 200)`,
        passed,
        `HTTP ${res.status}, Title: "${data.title}"`
      );
    }

    // ----------------------------------------------------------------
    // Test 5: Update an existing task (PUT /tasks/:id) -> Status 200
    // ----------------------------------------------------------------
    {
      const updatePayload = {
        title: 'Complete Practical 5 Mongoose Integration - Finished',
        completed: true,
        priority: 'high'
      };
      const res = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });
      const data = await res.json();
      const passed =
        res.status === 200 &&
        data._id === createdTaskId &&
        data.completed === true &&
        data.priority === 'high' &&
        data.title === updatePayload.title;

      recordResult(
        `5. PUT /tasks/:id - Update existing task with validation (Status 200)`,
        passed,
        `HTTP ${res.status}, Updated Completed: ${data.completed}, Priority: ${data.priority}`
      );
    }

    // ----------------------------------------------------------------
    // Test 6: Delete an existing task (DELETE /tasks/:id) -> Status 200
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks/${trimmedTaskId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      const passed = res.status === 200 && data.id === trimmedTaskId && data.message;
      recordResult(
        `6. DELETE /tasks/:id - Delete task from MongoDB (Status 200)`,
        passed,
        `HTTP ${res.status}, Message: "${data.message}", Deleted ID: ${data.id}`
      );
    }

    // ----------------------------------------------------------------
    // Test 7: Missing title validation (POST /tasks) -> Status 400
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: 'No title given'
        })
      });
      const data = await res.json();
      const passed = res.status === 400 && data.error === 'Validation failed' && Array.isArray(data.details);
      recordResult(
        '7. POST /tasks - Missing required title validation (Status 400)',
        passed,
        `HTTP ${res.status}, Error: "${data.error}", Field: "${data.details?.[0]?.field}"`
      );
    }

    // ----------------------------------------------------------------
    // Test 8: Invalid priority enum value (POST /tasks) -> Status 400
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Invalid Priority Task',
          priority: 'urgent' // Invalid: only 'low', 'medium', 'high' allowed
        })
      });
      const data = await res.json();
      const passed = res.status === 400 && data.error === 'Validation failed';
      recordResult(
        '8. POST /tasks - Invalid priority enum rejected (Status 400)',
        passed,
        `HTTP ${res.status}, Message: "${data.details?.[0]?.message}"`
      );
    }

    // ----------------------------------------------------------------
    // Test 9: Request with malformed MongoDB ID (GET /tasks/123-bad-id) -> Status 400
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks/123-bad-id`);
      const data = await res.json();
      const passed = res.status === 400 && data.error === 'Invalid task ID';
      recordResult(
        '9. GET /tasks/123-bad-id - Malformed MongoDB ID format (Status 400)',
        passed,
        `HTTP ${res.status}, Error: "${data.error}"`
      );
    }

    // ----------------------------------------------------------------
    // Test 10: Request with valid ObjectId but nonexistent task (GET /tasks/507f1f77bcf86cd799439011) -> Status 404
    // ----------------------------------------------------------------
    {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const res = await fetch(`${BASE_URL}/tasks/${nonExistentId}`);
      const data = await res.json();
      const passed = res.status === 404 && data.error === 'Task not found';
      recordResult(
        '10. GET /tasks/:id - Nonexistent task ID returns 404 (Status 404)',
        passed,
        `HTTP ${res.status}, Error: "${data.error}"`
      );
    }

    // ----------------------------------------------------------------
    // Test 11: Content-Type application/json verification (POST /tasks) -> Status 415
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: 'plain text'
      });
      const data = await res.json();
      const passed = res.status === 415;
      recordResult(
        '11. POST /tasks without application/json header (Status 415)',
        passed,
        `HTTP ${res.status}, Error: "${data.error || data.message}"`
      );
    }

    // ----------------------------------------------------------------
    // Test 12: Undefined route 404 handler (GET /api/unknown-route) -> Status 404
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/api/unknown-route`);
      const data = await res.json();
      const passed = res.status === 404 && data.error;
      recordResult(
        '12. GET /api/unknown-route - Undefined route custom 404 handler (Status 404)',
        passed,
        `HTTP ${res.status}, Error: "${data.error}"`
      );
    }

    console.log('\n====================================================');
    const totalPassed = results.filter((r) => r.passed).length;
    console.log(` Summary: ${totalPassed} / ${results.length} tests passed.`);
    console.log('====================================================\n');

    if (totalPassed === results.length) {
      console.log('🎉 ALL PRACTICAL 5 MONGODB API TESTS PASSED SUCCESSFULLY!');
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
