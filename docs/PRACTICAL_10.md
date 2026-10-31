# Practical 10: Asynchronous Processing with Event-Driven Architecture

- **Course:** Advanced Web Development Frameworks (ITUE301)
- **Degree:** B.Tech Information Technology (Semester 5)
- **Institution:** Charotar University of Science and Technology (CHARUSAT)
- **Student Name:** Max Patel
- **Roll Number:** 24IT070
- **GitHub Repository:** [https://github.com/max7199/SEM5WDF](https://github.com/max7199/SEM5WDF)
- **Frontend Stack:** React 18.3, Vite 5.4, JavaScript (ES6+), React Router v7, Tailwind/CSS3
- **Backend Stack:** Node.js 24, Express 5.3, MongoDB Community, Mongoose 9.11, Built-in `events` Module (`EventEmitter`), JWT, Bcrypt, `node-cache` 5.1
- **Screenshot Directory:** `screenshots/P10/`
- **Documentation File:** `docs/PRACTICAL_10.md`

---

## 1. Title and Objective

**Title:** Asynchronous Processing with Event-Driven Architecture  
**Course Outcomes (CO) / Program Outcomes (PO):** CO1 / PO3, PO5

### Objective:
Decouple secondary background tasks from primary request-response cycles in the existing Task Management backend using Node.js's built-in `EventEmitter` and asynchronous event scheduling:
1. Establish a centralized, shared `EventEmitter` instance (`events/taskEvents.js`) using Node.js's native `events` module without external dependencies.
2. Implement a background notification listener (`events/taskListeners.js`) subscribing to the `task-created` event, logging task details and timestamps.
3. Explicitly defer background listener processing to the event loop's check phase using `setImmediate()`, ensuring the HTTP API returns an immediate response (`HTTP 201 Created`) without awaiting listener execution.
4. Record and compare real high-resolution timestamps at both the API response point and the background event-handler point to prove non-blocking asynchronous execution.
5. Guarantee data integrity and security by emitting events strictly **after** database document creation succeeds, ensuring failed validations (HTTP 400) and unauthorized requests (HTTP 401) emit zero events.
6. Verify multi-task event handling, failure isolation, and zero regression across all previous practicals (Practicals 1–9).

---

## 2. Problem Statement

In conventional synchronous REST APIs, when an entity is created (such as a task in a task management system), auxiliary business operations—such as sending email notifications, firing webhook alerts, logging audit events, or recalculating user analytics—are often executed sequentially inside the request handler:

```text
[Client] ---> POST /tasks ---> [Save to DB] ---> [Send Email / Log Audit (100-500ms)] ---> [HTTP 201 Response]
```

### Critical Drawbacks of Synchronous Processing:
1. **High Latency:** The client endures high latency waiting for secondary tasks that do not impact the success of the creation request itself.
2. **Cascading Failures:** If an email service or notification logger experiences a network timeout or throws an exception, the entire HTTP request may fail, incorrectly indicating to the user that their task was not created even though it was already saved in MongoDB.
3. **Thread / Socket Exhaustion:** Long-running I/O operations block event loop microtasks and keep client HTTP connections open unnecessarily, drastically lowering the server's maximum request throughput.

### The Solution: Event-Driven Architecture (EDA)
By adopting an **Event-Driven Architecture (EDA)**, the API saves the document to MongoDB, dispatches an in-memory `task-created` event, and immediately returns `HTTP 201 Created` to the client. The secondary notification logic executes independently in the background:

```text
[Client] ---> POST /tasks ---> [Save to DB] ---> [Emit 'task-created'] ---> [HTTP 201 Response (Immediate)]
                                                         │
                                                         ▼
                                            [setImmediate Event Loop Check]
                                                         │
                                                         ▼
                                            [Background Notification Handler]
```

---

## 3. Technologies Used

| Technology | Version / Specification | Role in Practical 10 |
|---|---|---|
| **Node.js Built-in `events` Module** | Node.js v24 Native | Provides the core `EventEmitter` class for in-process publish-subscribe messaging without external dependencies. |
| **Node.js Event Loop (`setImmediate`)** | V8 / libuv Check Phase | Explicitly defers background listener execution until after the HTTP response socket is flushed. |
| **Express.js** | 5.3.0 | REST API framework handling authenticated routes, controllers, and middleware pipelines. |
| **MongoDB & Mongoose** | 9.11.1 | Document database and ODM providing persistence for user and task models. |
| **JSON Web Tokens (JWT)** | `jsonwebtoken` 9.0 | Cryptographic bearer token verification ensuring only authenticated users trigger events. |
| **Bcrypt.js** | 3.0.3 | Password hashing securing user accounts across authentication workflows. |
| **`node-cache`** | 5.1.2 | In-memory query caching established in Practical 9, co-existing with Practical 10. |
| **React & Vite** | React 18.3 / Vite 5.4 | Task Management frontend client built in Practicals 1–8. |

---

## 4. Explanation of Node.js EventEmitter

In Node.js, the `EventEmitter` class (from the built-in `node:events` module) is the foundation of the platform's asynchronous, event-driven architecture. Many core Node.js APIs—such as HTTP request/response streams, TCP sockets, and file streams—are instances of `EventEmitter`.

### How EventEmitter Works:
- **Publish-Subscribe Pattern:** An `EventEmitter` maintains an internal dictionary mapping event name strings (e.g. `'task-created'`) to arrays of listener functions.
- **`emitter.on(eventName, listener)`:** Registers a callback function to be called whenever `eventName` is triggered.
- **`emitter.emit(eventName, ...args)`:** Synchronously iterates through the array of registered listener functions for `eventName`, passing any provided arguments.
- **`emitter.setMaxListeners(n)`:** Adjusts the maximum listener threshold (default is 10) to prevent false-positive memory leak warnings when multiple components subscribe to identical events.

---

## 5. Event-Driven Architecture Flow

```text
  ┌───────────────────────────────────────────────────────────────────────────┐
  │                         Client (Postman / Frontend)                        │
  └─────────────────────────────────────┬─────────────────────────────────────┘
                                        │ HTTP POST /tasks (Bearer JWT)
                                        ▼
  ┌───────────────────────────────────────────────────────────────────────────┐
  │                     Express Router & authMiddleware                       │
  │  - Validates JWT signature and extracts req.user.id                       │
  │  - Rejects unauthenticated requests with HTTP 401 (Zero Events Emitted)    │
  └─────────────────────────────────────┬─────────────────────────────────────┘
                                        │ Authenticated Request
                                        ▼
  ┌───────────────────────────────────────────────────────────────────────────┐
  │                        taskController.createTask                          │
  │  1. Validates title (non-empty string); returns HTTP 400 on error         │
  │  2. Executes: await Task.create({ title, description, priority, user })   │
  │  3. Invalidates user task cache (Practical 9 node-cache integration)      │
  │  4. Captures: apiTimestamp = new Date().toISOString()                     │
  │  5. Logs: [API RESPONSE] Task created successfully at: <apiTimestamp>     │
  │  6. Dispatches: taskEvents.emit('task-created', { taskId, title, ... })   │
  │  7. Returns: res.status(201).json(newTask) IMMEDIATELY                    │
  └───────────────────┬───────────────────────────────────┬───────────────────┘
                      │                                   │
                      │ [Immediate HTTP 201 Response]     │ [taskEvents.emit('task-created')]
                      ▼                                   ▼
  ┌──────────────────────────────────────┐  ┌─────────────────────────────────┐
  │         Client Receives 201          │  │     taskListeners.js Listener   │
  │   - Average latency: ~3.88 ms        │  │  - Receives event payload       │
  │   - Contains full task JSON object   │  │  - Defers via setImmediate()    │
  └──────────────────────────────────────┘  └─────────────────┬───────────────┘
                                                              │
                                                              ▼
                                            ┌─────────────────────────────────┐
                                            │ Node.js Event Loop Check Phase  │
                                            │  - Executes setImmediate queue  │
                                            │  - handlerTimestamp = ISOString │
                                            │  - Logs [BACKGROUND NOTIFICATION│
                                            │  - Stores in notificationHistory│
                                            │  - Failure isolated in try/catch│
                                            └─────────────────────────────────┘
```

---

## 6. Detailed Implementation

### A. Centralized EventEmitter Instance (`events/taskEvents.js`)
A single, shared `EventEmitter` instance is created and exported across the application to prevent event fragmentation:

```javascript
// events/taskEvents.js
import { EventEmitter } from 'events';

// Create a single shared EventEmitter instance for the entire application
const taskEvents = new EventEmitter();

// Optional: increase max listeners if multiple listeners are registered in the future
taskEvents.setMaxListeners(20);

export default taskEvents;
```

### B. Background Notification Listener (`events/taskListeners.js`)
The listener subscribes to `'task-created'` and wraps its processing inside `setImmediate()`. This guarantees that the callback is queued for the **Check Phase** of the Node.js event loop, completely decoupling it from the HTTP response pipeline:

```javascript
// events/taskListeners.js
import taskEvents from './taskEvents.js';

let isInitialized = false;
const notificationHistory = [];

export const initTaskListeners = () => {
  if (isInitialized) {
    return;
  }

  taskEvents.on('task-created', (data) => {
    // Technical detail: Node.js EventEmitter calls listeners synchronously by default.
    // By wrapping the handler in setImmediate(), we explicitly defer its execution
    // to the check phase of the event loop. The HTTP response is returned to the client
    // before this background processing occurs.
    setImmediate(() => {
      try {
        const handlerTimestamp = new Date().toISOString();

        console.log(`[BACKGROUND NOTIFICATION] Processing task-created event at: ${handlerTimestamp}`);
        console.log(`  • Message:       🔔 New task notification dispatched`);
        console.log(`  • Task ID:       ${data.taskId}`);
        console.log(`  • Title:         "${data.title}"`);
        console.log(`  • Assigned User: ${data.userEmail || 'N/A'} (ID: ${data.userId})`);
        console.log(`  • API Timestamp: ${data.apiTimestamp}`);
        console.log(`  • Exec Timestamp: ${handlerTimestamp}`);

        // Store notification record for verification and testing
        notificationHistory.push({
          taskId: data.taskId,
          title: data.title,
          userId: data.userId,
          userEmail: data.userEmail || 'N/A',
          apiTimestamp: data.apiTimestamp,
          handlerTimestamp: handlerTimestamp,
          processedAt: Date.now()
        });
      } catch (err) {
        // Robust error handling: background failures must not crash server
        console.error('[BACKGROUND NOTIFICATION ERROR] Error in task-created listener:', err.message);
      }
    });
  });

  isInitialized = true;
  console.log('✓ Task event listeners initialized successfully');
};
```

### C. Task Controller Integration (`controllers/taskController.js`)
Inside `createTask`, document persistence and cache invalidation occur first. Once database success is confirmed, the API response timestamp is logged, the event is emitted, and HTTP 201 is returned immediately:

```javascript
// controllers/taskController.js (createTask)
export const createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Validation error: Task title is required and cannot be empty or whitespace only' });
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description || '',
      priority: priority || 'medium',
      user: req.user.id
    });

    // Invalidate user's in-memory task cache (Practical 9)
    invalidateUserTaskCache(req.user.id);

    // Practical 10: Asynchronous Processing with Event-Driven Architecture
    const apiTimestamp = new Date().toISOString();
    console.log(`[API RESPONSE] Task created successfully at: ${apiTimestamp}`);

    // Emit event asynchronously without awaiting listener completion
    taskEvents.emit('task-created', {
      taskId: newTask._id.toString(),
      title: newTask.title,
      userId: req.user.id,
      userEmail: req.user.email || null,
      apiTimestamp
    });

    // Return immediate HTTP 201 response to client
    return res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ error: 'Server error creating task' });
  }
};
```

### D. Single Listener Registration during Server Startup (`server.js`)
To prevent memory leaks and duplicate notifications caused by re-registering event handlers on every request, `initTaskListeners()` is executed once when `server.js` boots:

```javascript
// server.js
import { initTaskListeners } from './events/taskListeners.js';

// Initialize Practical 10 Asynchronous Event Listeners
initTaskListeners();
```

---

## 7. Deep Dive: `setImmediate()` vs Synchronous Execution

A common misconception is that calling `taskEvents.emit()` in Node.js automatically makes listener functions execute asynchronously in the background. **This is false.**

In Node.js, `EventEmitter.prototype.emit()` iterates through the registered callback functions **synchronously on the current call stack**. If a listener contains CPU-intensive logic or calls blocking synchronous operations, the controller execution is blocked, delaying the HTTP response.

```text
Synchronous emit() without setImmediate:
[Controller] ---> emit() ---> [Listener Runs To Completion] ---> [res.status(201).json()] (BLOCKED)

Asynchronous emit() with setImmediate:
[Controller] ---> emit() ---> [setImmediate queues callback] ---> [res.status(201).json()] (FLUSHED)
                                                                            │
                                   [Next Tick: Event Loop Check Phase] <────┘
                                   [Listener Executes in Background]
```

### Node.js Event Loop Execution Phases:
1. **Timers:** Executes callbacks scheduled by `setTimeout()` and `setInterval()`.
2. **Pending Callbacks:** Executes I/O callbacks deferred to the next loop iteration.
3. **Idle, Prepare:** Internal Node.js runtime operations.
4. **Poll Phase:** Retrieves new I/O events; executes I/O-related callbacks (e.g. Express HTTP request processing).
5. **Check Phase:** Executes callbacks scheduled by `setImmediate()`.
6. **Close Callbacks:** Executes close events (e.g. `socket.on('close')`).

By wrapping our listener work in `setImmediate()`, Express completes the Poll Phase and sends the HTTP response bytes over the network socket. The libuv event loop advances to the **Check Phase**, where our background notification handler executes.

---

## 8. Actual API Response vs Background Handler Timestamps

During automated verification (`npm run test:p10`), real high-resolution ISO 8601 timestamps were logged at both execution boundaries:

| Task Creation Run | Task ID & Title | API Response Timestamp (Point A) | Background Handler Timestamp (Point B) | Execution Delta |
|---|---|---|---|---:|
| **Test Task 1** | `6ae5dbbbb74cc625fcb444ad`<br>_Implement Node.js EventEmitter_ | `2026-10-31T12:14:51.693Z` | `2026-10-31T12:14:51.693Z` | `< 1 ms` |
| **Test Task 2** | `6ae5dbbbb74cc625fcb444ae`<br>_Second Task for Multi-Event Verification_ | `2026-10-31T12:14:51.773Z` | `2026-10-31T12:14:51.774Z` | `1 ms` |
| **Test Task 3** | `6ae5dbbbb74cc625fcb444af`<br>_Third Task for Multi-Event Verification_ | `2026-10-31T12:14:51.778Z` | `2026-10-31T12:14:51.778Z` | `< 1 ms` |

### Actual Terminal Output Snippet:
```text
[2026-10-31T12:14:51.772Z] POST /tasks
[API RESPONSE] Task created successfully at: 2026-10-31T12:14:51.773Z
[BACKGROUND NOTIFICATION] Processing task-created event at: 2026-10-31T12:14:51.774Z
  • Message:       🔔 New task notification dispatched
  • Task ID:       6ae5dbbbb74cc625fcb444ae
  • Title:         "Second Task for Multi-Event Verification"
  • Assigned User: eventuser_1793448891500@charusat.edu.in (ID: 6ae5dbbbb74cc625fcb444ac)
  • API Timestamp: 2026-10-31T12:14:51.773Z
  • Exec Timestamp: 2026-10-31T12:14:51.774Z
```

**Observation:** The timestamps are separated by fractions of a millisecond on local loopback, demonstrating that the API registers its completion and dispatches the HTTP 201 packet before the background handler processes the notification payload during the next check tick.

---

## 9. Screenshot Evidence Directory & Filenames

All 11 screenshots for Practical 10 are saved exclusively in:

`D:\5THSEM WDF\PRATICAL\screenshots\P10\`

| Filename | Description | File Size |
|---|---|---|
| `01-project-structure.png` | Directory tree showing `events/taskEvents.js`, `events/taskListeners.js`, controllers, and test suite | 59,652 bytes |
| `02-event-emitter-implementation.png` | Code editor view of `events/taskEvents.js` showing native `EventEmitter` instantiation | 55,982 bytes |
| `03-event-listener-implementation.png` | Code editor view of `events/taskListeners.js` showing `setImmediate()` decoupled listener | 74,251 bytes |
| `04-task-created-api-response.png` | Postman / Thunder Client HTTP 201 Created response for `POST /tasks` | 57,482 bytes |
| `05-background-notification-terminal-log.png` | Backend terminal logs showing `[BACKGROUND NOTIFICATION]` with task details and user ID | 50,947 bytes |
| `06-api-and-handler-timestamps.png` | Side-by-side terminal verification of `[API RESPONSE]` vs `[BACKGROUND NOTIFICATION]` timestamps | 56,840 bytes |
| `07-postman-task-creation.png` | Thunder Client UI displaying Bearer token header, JSON body, and 201 status code | 55,312 bytes |
| `08-multiple-task-notifications.png` | Terminal logs showing consecutive asynchronous event dispatches for multiple tasks | 33,568 bytes |
| `09-existing-authentication-verification.png` | HTTP 401 Unauthorized rejection when token is omitted, confirming 0 events emitted | 43,689 bytes |
| `10-final-test-results.png` | Automated test suite execution terminal (`test:p10`) showing 9/9 PASS (100% Green) | 66,933 bytes |
| `11-git-commit.png` | Git terminal showing `git status`, clean working tree, and commit `practical10` | 50,873 bytes |

---

## 10. Automated Verification & Regression Test Results

Executed via `npm run test:p10` (`node test-practical10.js`):

```text
====================================================
 Starting Practical 10 Asynchronous Event-Driven Test Suite
 Target Server: http://localhost:5000
====================================================

✅ PASS - 0. POST /debug/notifications/reset - Clean event history baseline
    Details: Count: 0
✅ PASS - 1. Authentication - Register and login user for Practical 10 tests
    Details: User ID: 6ae5dbbbb74cc625fcb444ac, Email: eventuser_1793448891500@charusat.edu.in
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

### Full Regression Verification Across Practicals 1–9:
- **Practical 9 Cache Test Suite (`npm run test:p9`):** **13/13 PASS (100%)** — in-memory cache hits, invalidation on POST/PUT/DELETE, and isolation all intact.
- **Practical 7 Auth Suite (`npm run test:p7`):** **20/20 PASS (100%)** — Bcrypt hashing, JWT generation, protected routes, and ownership verification intact.
- **Frontend Production Build (`npm run build`):** **Success in 903 ms** — all 3 lazy-loaded chunks (`TaskAnalytics`, `Projects`, `Contact`) generated cleanly.

---

## 11. Errors Encountered and Solutions

1. **Synchronous Call Stack Execution in EventEmitter:**
   - *Problem:* Calling `taskEvents.emit('task-created', data)` executed registered listener callbacks synchronously before `res.status(201).json(newTask)` was returned.
   - *Solution:* Wrapped the listener callback logic in `setImmediate(() => { ... })`. This queues execution into the libuv check phase after the poll phase, allowing the HTTP socket write to complete first.
2. **Global Middleware `Content-Type: application/json` Enforcement:**
   - *Problem:* In Practical 7, global middleware `checkContentType.js` was introduced to enforce `Content-Type: application/json` on all POST/PUT requests. Debug endpoints like `/debug/notifications/reset` returned HTTP 415 when invoked without explicit JSON headers.
   - *Solution:* Updated all client fetch calls and automated tests to include `'Content-Type': 'application/json'` with an empty JSON body `{}`.
3. **Database Write Failure Safety Boundary:**
   - *Problem:* If event emission occurred before or concurrently with `Task.create()`, a MongoDB schema validation failure would leave orphan notifications dispatched for tasks that never existed in the database.
   - *Solution:* Positioned `taskEvents.emit()` strictly **after** `await Task.create()` resolves. If an error is thrown, the catch block executes and zero events are emitted.

---

## 12. Limitations: In-Process EventEmitter vs Persistent Message Queues

While Node.js's built-in `EventEmitter` is ideal for lightweight, in-process event decoupling within a single server instance, it has fundamental architectural limitations compared to distributed, persistent message brokers:

| Feature | Built-in Node.js `EventEmitter` (Used in Practical 10) | Persistent Message Broker (RabbitMQ / Apache Kafka / Redis BullMQ) |
|---|---|---|
| **Storage Medium** | Volatile RAM (V8 process heap) | Durable disk storage / replicated memory |
| **Crash Durability** | **Zero durability:** If the Node.js process crashes or restarts, all pending in-memory events are permanently lost. | **Guaranteed persistence:** Unacknowledged messages remain safely queued and are processed when workers restart. |
| **Horizontal Scalability** | **Single process only:** Cannot distribute event listeners across multiple server nodes or PM2 cluster workers. | **Distributed:** Multiple consumer worker instances across different machines consume from shared queues with load balancing. |
| **Retry & Backoff Mechanism** | Manual implementation required; failed events are dropped unless manually caught and handled. | Built-in automatic retries with exponential backoff, dead-letter queues (DLQ), and error routing. |
| **Delivery Guarantees** | At-most-once in-memory dispatch. | Configurable guarantees (at-least-once, exactly-once processing). |
| **Backpressure Handling** | Unbounded memory queue: high event volume can cause heap memory exhaustion (OOM). | Built-in backpressure, consumer rate-limiting, and disk buffer management. |

**Conclusion:** For high-stakes asynchronous operations in production (such as sending transactional billing receipts, generating PDF reports, or credit card payment webhooks), persistent message brokers like **RabbitMQ**, **Kafka**, or **Redis BullMQ** are required. For decoupled local side effects (such as audit logging or local cache invalidation), built-in `EventEmitter` provides zero-overhead, ultra-fast performance.

---

## 13. Viva Voce Questions & Answers

### Q1. What is asynchronous processing?
**Answer:** Asynchronous processing is a computing paradigm where an operation is initiated without requiring the calling thread or client to block and wait for the operation to complete. The caller immediately continues with subsequent instructions, while the background operation executes concurrently and notifies or logs its result upon completion.

### Q2. What is event-driven architecture?
**Answer:** Event-driven architecture (EDA) is a software design pattern where decoupled software components communicate by producing, detecting, and consuming events. Instead of modules invoking each other directly via tight coupled method calls, a producer publishes an event (e.g. `'task-created'`) and interested consumers independently react to it.

### Q3. What is EventEmitter in Node.js?
**Answer:** `EventEmitter` is a core JavaScript class provided by the built-in `events` module in Node.js. It facilitates asynchronous communication between objects by allowing objects to emit named events and register corresponding listener callback functions using a publish-subscribe pattern.

### Q4. Why use the built-in `events` module?
**Answer:** The built-in `events` module is natively integrated into Node.js, requires zero external npm dependencies, produces zero package bloat, provides optimized memory performance, and serves as the architectural foundation upon which Node.js core streams and networking are built.

### Q5. What is an event?
**Answer:** An event is an identifiable signal or message indicating that a specific state change or significant business action has occurred within the system (e.g., `'task-created'`, `'user-registered'`, or `'cache-expired'`). Events typically carry payload data describing the context of the occurrence.

### Q6. What is an event listener?
**Answer:** An event listener is a callback function registered with an `EventEmitter` that is triggered and executed whenever a specific named event is emitted.

### Q7. What is the purpose of `emit()`?
**Answer:** The `emit(eventName, ...args)` method is used by an `EventEmitter` instance to trigger the specified event. It iterates through all registered listener callbacks associated with `eventName` and invokes them, passing along any arguments provided in the call.

### Q8. What is the purpose of `on()`?
**Answer:** The `on(eventName, listener)` method registers a listener function to be called every time the specified event is emitted. It enables multiple subscribers to listen for the same event independently.

### Q9. What is `setImmediate()`?
**Answer:** `setImmediate()` is a Node.js global scheduling function that schedules a callback function to run in the **Check Phase** of the libuv event loop. It defers execution until after the current I/O and Poll phase callbacks have completed, allowing Express to flush the HTTP response to the client before the deferred callback executes.

### Q10. Why should the API not wait for the notification handler?
**Answer:** Awaiting secondary operations (such as notification dispatching, logging, or third-party webhooks) increases client response latency, risks cascading failures if the secondary task encounters an error, and keeps server connections open unnecessarily. Returning immediately ensures high throughput and a responsive user experience.

### Q11. What is the difference between synchronous and asynchronous execution?
**Answer:**
- **Synchronous Execution:** Tasks execute sequentially in a single line. The execution thread is blocked until the current task completes before moving to the next.
- **Asynchronous Execution:** The execution thread dispatches a task to the background (or event loop queue) and immediately proceeds with subsequent operations without waiting for the task's completion.

### Q12. Why should events be emitted only after successful database creation?
**Answer:** To guarantee state consistency. If an event is emitted before or concurrently with database insertion, a subsequent database validation failure, unique constraint violation, or connection drop would mean secondary handlers (such as emails or audit logs) execute for an entity that was never persisted. Emitting strictly after `await Task.create()` guarantees that notifications correspond only to real database records.

### Q13. What happens if a background notification handler fails?
**Answer:** In our implementation, the background handler is wrapped inside a `try/catch` block within `setImmediate()`. If an error occurs, it is logged to `console.error` without throwing an unhandled exception. This failure isolation ensures the main application remains stable and the client's HTTP 201 response is never affected.

### Q14. Is EventEmitter a persistent message queue?
**Answer:** **No.** `EventEmitter` is an in-memory, process-local event dispatcher. It does not persist events to disk, does not support distributed subscribers across multiple server instances, and does not provide acknowledgment or dead-letter queue mechanisms.

### Q15. What happens to pending in-memory events if the Node.js process stops?
**Answer:** If the Node.js process crashes, is killed, or restarts, all pending in-memory events queued in the event loop or `EventEmitter` heap memory are **permanently lost**. Production applications requiring zero-loss background task execution use persistent queues like RabbitMQ, Apache Kafka, or Redis BullMQ.
