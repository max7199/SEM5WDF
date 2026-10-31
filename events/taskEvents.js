// =============================================================================
// Practical 10: Asynchronous Processing with Event-Driven Architecture
// File: events/taskEvents.js
// Description: Shared EventEmitter instance using Node.js's built-in 'events'
//              module for decoupled, in-process event emission and handling.
// =============================================================================

import { EventEmitter } from 'events';

// Create a single shared EventEmitter instance for the entire application
const taskEvents = new EventEmitter();

// Optional: increase max listeners if multiple listeners are registered in the future
taskEvents.setMaxListeners(20);

export default taskEvents;
