// =============================================================================
// Practical 10: Asynchronous Processing with Event-Driven Architecture
// File: events/taskListeners.js
// Description: Background notification listener for the 'task-created' event.
//              Uses setImmediate() to decouple notification processing from the
//              synchronous API response thread, logging timestamps and task data.
// =============================================================================

import taskEvents from './taskEvents.js';

let isInitialized = false;
const notificationHistory = [];

/**
 * Initialize event listeners.
 * Registered only once during server startup to prevent duplicate handler invocation.
 */
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
        console.log(`  ├── Message:       🔔 New task notification dispatched`);
        console.log(`  ├── Task ID:       ${data.taskId}`);
        console.log(`  ├── Title:         "${data.title}"`);
        console.log(`  ├── Assigned User: ${data.userEmail || 'N/A'} (ID: ${data.userId})`);
        console.log(`  ├── API Timestamp: ${data.apiTimestamp}`);
        console.log(`  └── Exec Timestamp: ${handlerTimestamp}`);

        // Store notification record for verification and testing
        notificationHistory.push({
          taskId: data.taskId,
          title: data.title,
          userId: data.userId,
          userEmail: data.userEmail,
          apiTimestamp: data.apiTimestamp,
          handlerTimestamp,
          processedAt: handlerTimestamp,
          status: 'PROCESSED'
        });
      } catch (err) {
        console.error('[BACKGROUND NOTIFICATION ERROR] Failed to process notification:', err.message);
      }
    });
  });

  isInitialized = true;
  console.log(' [Practical 10] Background Task Notification Listeners Initialized.');
};

/**
 * Retrieve recent background notification records (useful for automated testing)
 */
export const getNotificationHistory = () => {
  return [...notificationHistory];
};

/**
 * Clear notification history (for test isolation)
 */
export const clearNotificationHistory = () => {
  notificationHistory.length = 0;
};
