import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import logger from './middleware/logger.js';
import checkContentType from './middleware/checkContentType.js';
import errorHandler from './middleware/errorHandler.js';
import taskRoutes from './routes/tasks.js';
import authRoutes from './routes/auth.js';
import debugRoutes from './routes/debug.js';
import { initTaskListeners } from './events/taskListeners.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';

// ==========================================
// 1. GLOBAL MIDDLEWARE PIPELINE
// ==========================================

// Enable Cross-Origin Resource Sharing (CORS) for React frontend
app.use(cors());

// Request Logging Middleware: logs Method, URL, and Timestamp
app.use(logger);

// Content-Type Verification Middleware: rejects POST & PUT without application/json
app.use(checkContentType);

// Body Parser Middleware: parses incoming JSON bodies
app.use(express.json());

// ==========================================
// 2. ROUTES
// ==========================================

// Root API Information Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Practical 11: Containerization with Docker and Docker Compose API',
    student: 'Max Patel (24IT070)',
    course: 'Advanced Web Development Frameworks (ITUE301)',
    college: 'CHARUSAT',
    database: 'MongoDB (taskmanager)',
    features: [
      'JWT Authentication & Verification',
      'Bcrypt Password Hashing',
      'Protected Task Routes with User Isolation',
      'Server-Side Input Validation Pipeline',
      'In-Memory Caching (node-cache) with 60s TTL',
      'Automatic Cache Invalidation on Writes (POST, PUT, DELETE)',
      'Cache Hit/Miss Metrics Monitoring (/debug/cache)',
      'Asynchronous Event-Driven Architecture (Node.js EventEmitter)',
      'Background Task-Created Notification Processing (task-created)',
      'Decoupled setImmediate() Event Loop Execution',
      'Full-Stack Docker Containerization (Frontend, Backend, MongoDB)',
      'Docker Compose Multi-Container Orchestration',
      'Nginx Reverse Proxy & Single-Page Application Fallback',
      'Persistent Named Volume Storage (taskmanager_mongo_data)',
      'Isolated Bridge Networking (taskmanager_network)',
      'Container Health Check & Monitoring (/api/health)'
    ],
    endpoints: {
      health: {
        healthCheck: 'GET /health or /api/health'
      },
      auth: {
        register: 'POST /register (or /api/register, /auth/register)',
        login: 'POST /login (or /api/login, /auth/login)',
        me: 'GET /me (or /api/me, /auth/me) [Protected]'
      },
      tasks: {
        getAllTasks: 'GET /tasks (or /api/tasks) [Protected, Cached]',
        getSingleTask: 'GET /tasks/:id (or /api/tasks/:id) [Protected, Cached]',
        createTask: 'POST /tasks (or /api/tasks) [Protected, Emits task-created]',
        updateTask: 'PUT /tasks/:id (or /api/tasks/:id) [Protected, Invalidates Cache]',
        deleteTask: 'DELETE /tasks/:id (or /api/tasks/:id) [Protected, Invalidates Cache]'
      },
      debug: {
        cacheMetrics: 'GET /debug/cache (or /api/debug/cache)',
        cacheReset: 'POST /debug/cache/reset (or /api/debug/cache/reset)',
        notifications: 'GET /debug/notifications (or /api/debug/notifications)',
        notificationsReset: 'POST /debug/notifications/reset (or /api/debug/notifications/reset)'
      }
    }
  });
});

// Health check endpoint for Docker container orchestration and monitoring (Practical 11)
app.get(['/health', '/api/health'], (req, res) => {
  const dbState = mongoose.connection.readyState;
  const statusMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: statusMap[dbState] || 'unknown',
    services: {
      server: 'online',
      database: dbState === 1 ? 'healthy' : 'degraded',
      cache: 'active',
      events: 'active'
    }
  });
});

// Mount Authentication Routes
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', authRoutes);
app.use('/', authRoutes);

// Mount Task Management Routes
app.use('/tasks', taskRoutes);
app.use('/api/tasks', taskRoutes);

// Mount Cache & Notification Debug Routes (Practical 9 & 10)
app.use('/debug', debugRoutes);
app.use('/api/debug', debugRoutes);

// Simulation route for verifying 500 error handler
app.get('/simulate-error', (req, res, next) => {
  next(new Error('Simulated unhandled internal server error'));
});

// ==========================================
// 3. 404 NOT FOUND HANDLER (Undefined Routes)
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    error: `Cannot ${req.method} ${req.originalUrl} - Route not found.`
  });
});

// ==========================================
// 4. GLOBAL ERROR-HANDLING MIDDLEWARE
// ==========================================
app.use(errorHandler);

// ==========================================
// 5. DATABASE CONNECTION & SERVER START
// ==========================================
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
      console.log(` Practical 10 Server running at: http://localhost:${PORT}`);
      console.log(` Endpoints:`);
      console.log(`   - GET    http://localhost:${PORT}/tasks`);
      console.log(`   - GET    http://localhost:${PORT}/tasks/:id`);
      console.log(`   - POST   http://localhost:${PORT}/tasks [Emits task-created]`);
      console.log(`   - PUT    http://localhost:${PORT}/tasks/:id`);
      console.log(`   - DELETE http://localhost:${PORT}/tasks/:id`);
      console.log(`   - GET    http://localhost:${PORT}/debug/cache`);
      console.log(`   - GET    http://localhost:${PORT}/debug/notifications`);
      console.log(`=======================================================`);
    });

    return { app, server, conn };
  } catch (error) {
    console.error(`=======================================================`);
    console.error(`❌ MongoDB Connection Failed!`);
    console.error(` Error: ${error.message}`);
    console.error(` Please ensure MongoDB Server is installed and running.`);
    console.error(`=======================================================`);
    process.exit(1);
  }
};

// Initiate Database Connection
connectDB();

export { app, server, connectDB };
export default app;
