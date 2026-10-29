/**
 * Automated Test Suite for Practical 7: Authentication & Middleware Pipeline
 * Student: Max Patel (24IT070) - CHARUSAT - ITUE301
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';

const results = [];

function recordResult(testName, passed, details) {
  results.push({ testName, passed, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} - ${testName}`);
  if (details) {
    console.log(`    Details: ${details}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log(' Starting Practical 7 Authentication & Middleware Test Suite');
  console.log(` Target Server: ${BASE_URL}`);
  console.log('====================================================\n');

  let user1Token = null;
  let user1Id = null;
  const user1Email = `testuser_${Date.now()}@charusat.edu.in`;
  const user1Password = 'Password123!';

  let user2Token = null;
  let user2Id = null;
  const user2Email = `seconduser_${Date.now()}@charusat.edu.in`;
  const user2Password = 'SecretPass456!';

  let user1TaskId = null;

  try {
    // ----------------------------------------------------------------
    // Test 1: Register User 1 successfully (POST /register) -> Status 201
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user1Email, password: user1Password })
      });
      const data = await res.json();
      user1Id = data.user?.id;
      const passed =
        res.status === 201 &&
        data.success === true &&
        data.user?.email === user1Email.toLowerCase() &&
        !data.user?.password; // Must never return password

      recordResult(
        '1. POST /register - Register User 1 successfully (Status 201)',
        passed,
        `Status: ${res.status}, ID: ${user1Id}, Password hidden: ${!data.user?.password}`
      );
    }

    // ----------------------------------------------------------------
    // Test 2: Verify direct MongoDB document has bcrypt hash, not plain text
    // ----------------------------------------------------------------
    {
      const conn = await mongoose.connect(MONGO_URI);
      const db = conn.connection.db;
      const userDoc = await db.collection('users').findOne({ email: user1Email.toLowerCase() });

      const isBcrypt =
        userDoc &&
        typeof userDoc.password === 'string' &&
        userDoc.password.startsWith('$2') &&
        userDoc.password !== user1Password;

      recordResult(
        '2. MongoDB Document - Password stored as bcrypt hash, not plain text',
        isBcrypt,
        `Stored Hash Prefix: ${userDoc?.password?.substring(0, 10)}... (Length: ${userDoc?.password?.length})`
      );
    }

    // ----------------------------------------------------------------
    // Test 3: Reject duplicate email registration (POST /register) -> Status 400
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user1Email, password: 'DifferentPassword' })
      });
      const data = await res.json();
      const passed = res.status === 400 && data.success === false;
      recordResult(
        '3. POST /register - Reject duplicate email registration (Status 400)',
        passed,
        `Status: ${res.status}, Error: ${data.error}`
      );
    }

    // ----------------------------------------------------------------
    // Test 4: Validation: Reject registration with short password (<6 chars) -> Status 400
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'shortpass@charusat.edu.in', password: '123' })
      });
      const data = await res.json();
      const passed = res.status === 400 && data.success === false;
      recordResult(
        '4. POST /register - Reject password shorter than 6 characters (Status 400)',
        passed,
        `Status: ${res.status}, Error: ${data.error}`
      );
    }

    // ----------------------------------------------------------------
    // Test 5: Login with correct credentials (POST /login) -> Status 200, JWT returned
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user1Email, password: user1Password })
      });
      const data = await res.json();
      user1Token = data.token;
      const passed =
        res.status === 200 &&
        data.success === true &&
        typeof data.token === 'string' &&
        data.token.length > 20 &&
        !data.user?.password;

      recordResult(
        '5. POST /login - Log in with correct credentials (Status 200 & JWT)',
        passed,
        `Status: ${res.status}, Token received (first 20 chars): ${data.token?.substring(0, 20)}...`
      );
    }

    // ----------------------------------------------------------------
    // Test 6: Reject login with incorrect password (POST /login) -> Status 401
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user1Email, password: 'WrongPassword!' })
      });
      const data = await res.json();
      const passed = res.status === 401 && data.success === false;
      recordResult(
        '6. POST /login - Reject incorrect password (Status 401 Unauthorized)',
        passed,
        `Status: ${res.status}, Error: ${data.error}`
      );
    }

    // ----------------------------------------------------------------
    // Test 7: Protected Route: GET /me with valid Bearer token -> Status 200
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user1Token}`,
          'Accept': 'application/json'
        }
      });
      const data = await res.json();
      const passed =
        res.status === 200 &&
        data.success === true &&
        data.user?.email === user1Email.toLowerCase() &&
        !data.user?.password;

      recordResult(
        '7. GET /me - Retrieve safe user profile with Bearer token (Status 200)',
        passed,
        `Status: ${res.status}, User ID: ${data.user?.id}, Email: ${data.user?.email}`
      );
    }

    // ----------------------------------------------------------------
    // Test 8: Protected Route: GET /me without token -> Status 401
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/me`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();
      const passed = res.status === 401 && data.success === false;
      recordResult(
        '8. GET /me - Reject request without token (Status 401 Unauthorized)',
        passed,
        `Status: ${res.status}, Error: ${data.error}`
      );
    }

    // ----------------------------------------------------------------
    // Test 9: Protected Task Route: GET /tasks without token -> Status 401
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();
      const passed = res.status === 401 && data.success === false;
      recordResult(
        '9. GET /tasks - Reject task access without token (Status 401 Unauthorized)',
        passed,
        `Status: ${res.status}, Error: ${data.error}`
      );
    }

    // ----------------------------------------------------------------
    // Test 10: Robustness: Tampered/Invalid JWT must return 401 and not crash server
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.payload',
          'Accept': 'application/json'
        }
      });
      const data = await res.json();
      const passed = res.status === 401 && data.success === false;
      recordResult(
        '10. GET /tasks - Tampered/Invalid token rejected safely (Status 401)',
        passed,
        `Status: ${res.status}, Error: ${data.error}`
      );
    }

    // ----------------------------------------------------------------
    // Test 11: Server-side validation: Reject task creation without title -> Status 400
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user1Token}`
        },
        body: JSON.stringify({ title: '   ', description: 'Whitespace only title' })
      });
      const data = await res.json();
      const passed = res.status === 400 && data.success === false;
      recordResult(
        '11. POST /tasks - Reject missing or whitespace-only title (Status 400)',
        passed,
        `Status: ${res.status}, Error: ${data.error}`
      );
    }

    // ----------------------------------------------------------------
    // Test 12: Authenticated CRUD: Create task for User 1 (POST /tasks) -> Status 201
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user1Token}`
        },
        body: JSON.stringify({
          title: 'Implement Practical 7 JWT Pipeline',
          description: 'Authenticate routes with Express middleware',
          priority: 'high'
        })
      });
      const data = await res.json();
      user1TaskId = data._id;
      const passed =
        res.status === 201 &&
        data._id &&
        data.user === user1Id &&
        data.title === 'Implement Practical 7 JWT Pipeline';

      recordResult(
        '12. POST /tasks - Create task for authenticated User 1 (Status 201)',
        passed,
        `Status: ${res.status}, Task ID: ${data._id}, Owner: ${data.user}`
      );
    }

    // ----------------------------------------------------------------
    // Test 13: Authenticated CRUD: Read tasks for User 1 (GET /tasks) -> Status 200
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user1Token}`,
          'Accept': 'application/json'
        }
      });
      const data = await res.json();
      const passed = res.status === 200 && Array.isArray(data) && data.some((t) => t._id === user1TaskId);
      recordResult(
        '13. GET /tasks - Fetch tasks belonging to User 1 (Status 200)',
        passed,
        `Status: ${res.status}, Found Task Count for User 1: ${data.length}`
      );
    }

    // ----------------------------------------------------------------
    // Test 14: Authenticated CRUD: Update task for User 1 (PUT /tasks/:id) -> Status 200
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks/${user1TaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user1Token}`
        },
        body: JSON.stringify({
          completed: true,
          description: 'Updated with verified test results'
        })
      });
      const data = await res.json();
      const passed = res.status === 200 && data.completed === true;
      recordResult(
        '14. PUT /tasks/:id - Update task for authenticated User 1 (Status 200)',
        passed,
        `Status: ${res.status}, Completed: ${data.completed}`
      );
    }

    // ----------------------------------------------------------------
    // Test 15: Register User 2 and obtain User 2 token
    // ----------------------------------------------------------------
    {
      const regRes = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user2Email, password: user2Password })
      });
      const regData = await regRes.json();
      user2Id = regData.user?.id;

      const loginRes = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user2Email, password: user2Password })
      });
      const loginData = await loginRes.json();
      user2Token = loginData.token;

      const passed = Boolean(user2Token);
      recordResult(
        '15. Setup User 2 - Register and authenticate second user',
        passed,
        `User 2 ID: ${user2Id}`
      );
    }

    // ----------------------------------------------------------------
    // Test 16: User Isolation: User 2 CANNOT access User 1's task (GET /tasks/:id) -> Status 404
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks/${user1TaskId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user2Token}`,
          'Accept': 'application/json'
        }
      });
      const passed = res.status === 404;
      recordResult(
        '16. Isolation: User 2 cannot read User 1 task (Status 404 Not Found)',
        passed,
        `Status: ${res.status} (Unauthorized access securely hidden)`
      );
    }

    // ----------------------------------------------------------------
    // Test 17: User Isolation: User 2 CANNOT update User 1's task (PUT /tasks/:id) -> Status 404
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks/${user1TaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user2Token}`
        },
        body: JSON.stringify({ title: 'Hacked by User 2' })
      });
      const passed = res.status === 404;
      recordResult(
        '17. Isolation: User 2 cannot update User 1 task (Status 404 Not Found)',
        passed,
        `Status: ${res.status} (Unauthorized modification prevented)`
      );
    }

    // ----------------------------------------------------------------
    // Test 18: User Isolation: User 2 CANNOT delete User 1's task (DELETE /tasks/:id) -> Status 404
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks/${user1TaskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user2Token}`
        }
      });
      const passed = res.status === 404;
      recordResult(
        '18. Isolation: User 2 cannot delete User 1 task (Status 404 Not Found)',
        passed,
        `Status: ${res.status} (Unauthorized deletion prevented)`
      );
    }

    // ----------------------------------------------------------------
    // Test 19: User 1 can delete their own task (DELETE /tasks/:id) -> Status 200
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/tasks/${user1TaskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user1Token}`
        }
      });
      const data = await res.json();
      const passed = res.status === 200 && data.id === user1TaskId;
      recordResult(
        '19. DELETE /tasks/:id - User 1 deletes their own task (Status 200)',
        passed,
        `Status: ${res.status}, Deleted Task ID: ${data.id}`
      );
    }

    // ----------------------------------------------------------------
    // Test 20: Practical 1-6 Intact: Root API endpoint (GET /) -> Status 200
    // ----------------------------------------------------------------
    {
      const res = await fetch(`${BASE_URL}/`);
      const data = await res.json();
      const passed = res.status === 200 && data.success === true && data.student.includes('24IT070');
      recordResult(
        '20. GET / - Root API route preserved and returns Practical 7 specs',
        passed,
        `Status: ${res.status}, Message: ${data.message}`
      );
    }
  } catch (err) {
    console.error('Fatal test runner error:', err);
  } finally {
    await mongoose.disconnect();
  }

  // Summary
  console.log('\n====================================================');
  console.log(' Practical 7 Test Results Summary');
  console.log('====================================================');
  const total = results.length;
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = total - passedCount;
  console.log(`Total Tests Run: ${total}`);
  console.log(`Passed:          ${passedCount}`);
  console.log(`Failed:          ${failedCount}`);
  console.log('====================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
