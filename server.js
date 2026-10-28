import express from 'express';
import logger from './middleware/logger.js';
import checkContentType from './middleware/checkContentType.js';
import errorHandler from './middleware/errorHandler.js';
import taskRoutes from './routes/tasks.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. GLOBAL MIDDLEWARE PIPELINE
// ==========================================

// Global Request Logger Middleware: logs Method, URL, and Timestamp
app.use(logger);

// Content-Type Verification Middleware: rejects POST & PUT requests without application/json
app.use(checkContentType);

// Body Parser Middleware: parses JSON request bodies
app.use(express.json());

// ==========================================
// 2. ROUTES
// ==========================================

// API Information Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Practical 4 RESTful Task Management API',
    student: 'Max Patel (24IT070)',
    endpoints: {
      getAllTasks: 'GET /tasks',
      createTask: 'POST /tasks',
      updateTask: 'PUT /tasks/:id',
      deleteTask: 'DELETE /tasks/:id'
    }
  });
});

// Mount Task Management Routes
app.use('/tasks', taskRoutes);

// Route for testing/simulating internal 500 errors
app.get('/simulate-error', (req, res, next) => {
  next(new Error('Simulated unhandled internal server error'));
});

// ==========================================
// 3. 404 NOT FOUND HANDLER (Undefined Routes)
// ==========================================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl} - Route not found.`
  });
});

// ==========================================
// 4. GLOBAL ERROR-HANDLING MIDDLEWARE
// ==========================================
// Placed after all routes and 404 handler
app.use(errorHandler);

// ==========================================
// 5. START SERVER
// ==========================================
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Practical 4: RESTful Task Management API Server`);
  console.log(` Student: Max Patel (24IT070)`);
  console.log(` Server is running on: http://localhost:${PORT}`);
  console.log(` Endpoints available:`);
  console.log(`   - GET    http://localhost:${PORT}/tasks`);
  console.log(`   - POST   http://localhost:${PORT}/tasks`);
  console.log(`   - PUT    http://localhost:${PORT}/tasks/:id`);
  console.log(`   - DELETE http://localhost:${PORT}/tasks/:id`);
  console.log(`=======================================================`);
});

export { app, server };
export default app;
