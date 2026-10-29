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
    message: 'Welcome to Practical 7: Authentication & Middleware Pipeline API',
    student: 'Max Patel (24IT070)',
    course: 'Advanced Web Development Frameworks (ITUE301)',
    college: 'CHARUSAT',
    database: 'MongoDB (taskmanager)',
    features: [
      'JWT Authentication & Verification',
      'Bcrypt Password Hashing',
      'Protected Task Routes with User Isolation',
      'Server-Side Input Validation Pipeline'
    ],
    endpoints: {
      auth: {
        register: 'POST /register (or /auth/register)',
        login: 'POST /login (or /auth/login)',
        me: 'GET /me (or /auth/me) [Protected]'
      },
      tasks: {
        getAllTasks: 'GET /tasks [Protected]',
        getSingleTask: 'GET /tasks/:id [Protected]',
        createTask: 'POST /tasks [Protected]',
        updateTask: 'PUT /tasks/:id [Protected]',
        deleteTask: 'DELETE /tasks/:id [Protected]'
      }
    }
  });
});

// Mount Authentication Routes
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/', authRoutes);

// Mount Task Management Routes
app.use('/tasks', taskRoutes);
app.use('/api/tasks', taskRoutes);

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

    server = app.listen(PORT, () => {
      console.log(` Practical 5 Server running at: http://localhost:${PORT}`);
      console.log(` Endpoints:`);
      console.log(`   - GET    http://localhost:${PORT}/tasks`);
      console.log(`   - GET    http://localhost:${PORT}/tasks/:id`);
      console.log(`   - POST   http://localhost:${PORT}/tasks`);
      console.log(`   - PUT    http://localhost:${PORT}/tasks/:id`);
      console.log(`   - DELETE http://localhost:${PORT}/tasks/:id`);
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
