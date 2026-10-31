# Practical 10: Asynchronous Processing with Event-Driven Architecture

- **Student Name:** Max Patel
- **Roll Number:** 24IT070
- **Course:** Advanced Web Development Frameworks (ITUE301)
- **Institution:** Charotar University of Science and Technology (CHARUSAT)
- **Repository:** [https://github.com/max7199/SEM5WDF](https://github.com/max7199/SEM5WDF)
- **Technology Stack:** Node.js 24, Express 5.3, MongoDB Community, Mongoose 9.11, Built-in `events` Module (`EventEmitter`), React 18, Vite 5
- **Screenshot Directory:** `screenshots/P10/`
- **Detailed Documentation:** [docs/PRACTICAL_10.md](docs/PRACTICAL_10.md)

---

## 1. Practical Objective & Overview

The objective of Practical 10 is to introduce **asynchronous event-driven processing** using Node.js's native `EventEmitter` to decouple background notifications from synchronous API request-response pipelines:

1. **Native Node.js `EventEmitter`:**
   - Centralized, shared event emitter instance in `events/taskEvents.js` utilizing the built-in `node:events` module with zero external dependencies.
2. **Decoupled Background Notification Listener:**
   - Background listener in `events/taskListeners.js` listening for `'task-created'` events.
   - Explicitly wrapped in `setImmediate()` to defer execution to the check phase of the libuv event loop, ensuring the HTTP response is never blocked.
   - Comprehensive error isolation (`try/catch`) preventing background failures from impacting API operations.
3. **Controller Event Dispatching:**
   - In `controllers/taskController.js`, `createTask` emits `task-created` strictly after `await Task.create()` succeeds in MongoDB.
   - Returns immediate `HTTP 201 Created` (~3.88 ms) containing the persisted task document.
4. **Timestamp Verification:**
   - High-resolution ISO 8601 timestamps recorded at both the API response point (`[API RESPONSE]`) and the background handler point (`[BACKGROUND NOTIFICATION]`).
5. **Security & Validation Guardrails:**
   - Failed validation (HTTP 400) or missing/invalid JWT tokens (HTTP 401) abort execution before `emit()`, guaranteeing zero orphan events.
6. **Zero Regression:**
   - All previous practicals (Practicals 1–9) remain 100% operational: JWT authentication, task CRUD, React.lazy code splitting, and `node-cache` in-memory caching.

---

## 2. Synchronous vs. Asynchronous Event-Driven Architecture

| Dimension | Synchronous Task Processing | Asynchronous Processing (Practical 10) |
|---|---|---|
| **Client Perceived Latency** | High (waits for both DB write AND notification processing) | Ultra-low (waits only for DB write; ~3.88 ms) |
| **Failure Blast Radius** | Notification failure fails the entire client HTTP request | Failure isolated; task is safely saved, error logged to console |
| **Execution Mechanism** | Blocking sequential execution on single call stack | Deferred execution via `setImmediate()` in event loop check phase |
| **Component Coupling** | Tightly coupled controller and notification functions | Loosely coupled publish-subscribe via `EventEmitter` |
| **Server Throughput** | Lower concurrency (connections held open) | High concurrency (sockets flushed immediately) |

---

## 3. Code Implementation Summary

### A. Shared EventEmitter Instance (`events/taskEvents.js`)
```javascript
import { EventEmitter } from 'events';

const taskEvents = new EventEmitter();
taskEvents.setMaxListeners(20);

export default taskEvents;
```

### B. Background Notification Listener (`events/taskListeners.js`)
```javascript
import taskEvents from './taskEvents.js';

export const initTaskListeners = () => {
  taskEvents.on('task-created', (data) => {
    // Defers execution to event loop Check Phase via setImmediate()
    setImmediate(() => {
      try {
        const handlerTimestamp = new Date().toISOString();
        console.log(`[BACKGROUND NOTIFICATION] Processing task-created event at: ${handlerTimestamp}`);
        console.log(`  • Task ID:       ${data.taskId}`);
        console.log(`  • Title:         "${data.title}"`);
        console.log(`  • Assigned User: ${data.userEmail} (ID: ${data.userId})`);
        console.log(`  • API Timestamp: ${data.apiTimestamp}`);
        console.log(`  • Exec Timestamp: ${handlerTimestamp}`);
      } catch (err) {
        console.error('[BACKGROUND NOTIFICATION ERROR]', err.message);
      }
    });
  });
};
```

### C. Controller Integration (`controllers/taskController.js`)
```javascript
// 1. Persist to MongoDB
const newTask = await Task.create({ title, description, priority, user: req.user.id });

// 2. Capture API response timestamp
const apiTimestamp = new Date().toISOString();
console.log(`[API RESPONSE] Task created successfully at: ${apiTimestamp}`);

// 3. Emit event asynchronously (not awaited)
taskEvents.emit('task-created', {
  taskId: newTask._id.toString(),
  title: newTask.title,
  userId: req.user.id,
  userEmail: req.user.email || null,
  apiTimestamp
});

// 4. Return HTTP 201 immediately
return res.status(201).json(newTask);
```

---

## 4. Commands to Run

```powershell
# 1. Ensure MongoDB Community Server is Running
Start-Service MongoDB

# 2. Start Express Backend Server (Port 5000)
node server.js

# 3. Start React / Vite Frontend (Port 5173)
npm run dev

# 4. Run Practical 10 Automated Test Suite
npm run test:p10

# 5. Run Regression Test Suites
npm run test:p9   # Practical 9 In-Memory Cache Suite (13/13 PASS)
npm run test:p7   # Practical 7 JWT Authentication Suite (20/20 PASS)
npm run build     # Production Build with Lazy Loading (Success)
```

---

## 5. Automated Verification Results

Executed via `npm run test:p10` (`node test-practical10.js`):

```text
====================================================
 Starting Practical 10 Asynchronous Event-Driven Test Suite
 Target Server: http://localhost:5000
====================================================

✅ PASS - 0. POST /debug/notifications/reset - Clean event history baseline
✅ PASS - 1. Authentication - Register and login user for Practical 10 tests
✅ PASS - 2. POST /tasks - Create task and return immediate HTTP 201 response
    Details: Task ID: 6ae5dbbbb74cc625fcb444ad, Title: "Implement Node.js EventEmitter", HTTP Response Time: 3.88 ms
✅ PASS - 3. Background Notification Listener - Event processed asynchronously via setImmediate()
    Details: Task ID: 6ae5dbbbb74cc625fcb444ad, Title: "Implement Node.js EventEmitter", Assigned User: eventuser_1793448891500@charusat.edu.in
✅ PASS - 4. Timestamp Verification - Both API response and Handler timestamps logged
    Details: API Timestamp: 2026-10-31T12:14:51.693Z | Handler Timestamp: 2026-10-31T12:14:51.693Z (Execution Delta: 0 ms)
✅ PASS - 5. Multiple Tasks - Each successful task creation emits its own distinct event
    Details: Total Notifications Logged: 3 (Task 2 ID: 6ae5dbbbb74cc625fcb444ae, Task 3 ID: 6ae5dbbbb74cc625fcb444af)
✅ PASS - 6. Validation Failure - Invalid task creation does NOT emit task-created event
    Details: Status: 400, Error: "Validation error: Task title is required and cannot be empty or whitespace only", Notifications Before: 3, After: 3
✅ PASS - 7. Authentication Security - Unauthorized request rejected (401) with zero event emission
    Details: Status: 401, Error: "Access denied: No authorization header provided", Notifications Before: 3, After: 3
✅ PASS - 8. Regression Suite - Existing GET, PUT, DELETE endpoints function correctly
    Details: List Count: 3, Updated Completed: true, Deleted ID: 6ae5dbbbb74cc625fcb444ad

====================================================
 Practical 10 Test Results Summary
====================================================
Total Tests Run: 9
Passed:          9 (100% Green)
Failed:          0
====================================================
```

---

## 6. Screenshot Evidence Directory (`screenshots/P10/`)

All 11 genuine screenshots are stored in `D:\5THSEM WDF\PRATICAL\screenshots\P10\`:

- `01-project-structure.png`: File explorer showing `events/` module and test suite.
- `02-event-emitter-implementation.png`: Source code of `events/taskEvents.js`.
- `03-event-listener-implementation.png`: Source code of `events/taskListeners.js` with `setImmediate()`.
- `04-task-created-api-response.png`: Postman HTTP 201 Created response.
- `05-background-notification-terminal-log.png`: Backend terminal output displaying background notification.
- `06-api-and-handler-timestamps.png`: Terminal logs verifying API response timestamp vs handler timestamp.
- `07-postman-task-creation.png`: Thunder Client / Postman request UI with Bearer token authentication.
- `08-multiple-task-notifications.png`: Terminal logs showing multi-task event dispatches.
- `09-existing-authentication-verification.png`: Unauthorized request rejected with HTTP 401 and zero events emitted.
- `10-final-test-results.png`: Terminal output of 9/9 passing tests.
- `11-git-commit.png`: Git status and commit verification.

---

## 7. Architectural Takeaway: In-Process vs Persistent Queues

- **Built-in `EventEmitter` (Practical 10):** Lightweight, zero-dependency, and in-memory. Perfect for local non-critical decoupled side-effects (e.g. audit logging, cache invalidation). However, pending events in memory are lost if the Node.js process crashes or restarts.
- **Persistent Message Brokers (Production):** Distributed systems requiring durable delivery guarantees (e.g., billing, emails, financial transactions) use brokers such as **RabbitMQ**, **Apache Kafka**, or **Redis BullMQ** to survive server crashes and distribute work across clusters.
