// =============================================================================
// Practical 12: CI/CD Pipeline with GitHub Actions
// File: app.js
// Description: Express Application configuration, middleware, and route mounting.
//              Separated from server.js to allow unit/integration testing with Supertest
//              without binding to physical network ports.
// Student: Max Patel (24IT070) - CHARUSAT - ITUE301
// =============================================================================

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import logger from './middleware/logger.js';
import checkContentType from './middleware/checkContentType.js';
import errorHandler from './middleware/errorHandler.js';
import taskRoutes from './routes/tasks.js';
import authRoutes from './routes/auth.js';
import debugRoutes from './routes/debug.js';

const app = express();

// ==========================================
// 1. GLOBAL MIDDLEWARE PIPELINE
// ==========================================

// Enable Cross-Origin Resource Sharing (CORS)
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
    message: 'Welcome to Practical 12: CI/CD Pipeline with GitHub Actions API',
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
      'Continuous Integration & Deployment (CI/CD) with GitHub Actions',
      'Automated Jest & Supertest Integration Test Suite',
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

// Health check endpoint for Docker container orchestration & CI/CD probes
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
      database: dbState === 1 ? 'healthy' : 'disconnected_or_mocked',
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

export default app;
export { app };
