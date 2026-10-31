// =============================================================================
// Practical 12: CI/CD Pipeline with GitHub Actions
// File: server.js
// Description: Server entry point: connects to MongoDB and starts listening on PORT.
//              Imports the configured Express application from app.js.
// Student: Max Patel (24IT070) - CHARUSAT - ITUE301
// =============================================================================

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './app.js';
import { initTaskListeners } from './events/taskListeners.js';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';

let server;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`=======================================================`);
    console.log(` MongoDB Connected Successfully!`);
    console.log(` Host:     ${conn.connection.host}`);
    console.log(` Database: ${conn.connection.name}`);
    console.log(`=======================================================`);

    // Initialize Practical 10 background event listeners
    initTaskListeners();

    server = app.listen(PORT, () => {
      console.log(` Practical 12 Server running at: http://localhost:${PORT}`);
      console.log(` Endpoints:`);
      console.log(`   - GET    http://localhost:${PORT}/tasks`);
      console.log(`   - GET    http://localhost:${PORT}/tasks/:id`);
      console.log(`   - POST   http://localhost:${PORT}/tasks [Emits task-created]`);
      console.log(`   - PUT    http://localhost:${PORT}/tasks/:id`);
      console.log(`   - DELETE http://localhost:${PORT}/tasks/:id`);
      console.log(`   - GET    http://localhost:${PORT}/debug/cache`);
      console.log(`   - GET    http://localhost:${PORT}/debug/notifications`);
      console.log(`   - GET    http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });

    return server;
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Start server if run directly
connectDB();

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('\nShutting down server gracefully...');
  if (server) {
    server.close();
  }
  await mongoose.connection.close();
  process.exit(0);
});

export { app, server };
