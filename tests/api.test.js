// =============================================================================
// Practical 12: CI/CD Pipeline with GitHub Actions
// File: tests/api.test.js
// Description: Automated integration test suite using Jest and Supertest.
//              Tests API health, routing, middleware pipeline, validation,
//              and JWT authentication barriers.
// Student: Max Patel (24IT070) - CHARUSAT - ITUE301
// =============================================================================

import request from 'supertest';
import app from '../app.js';

describe('Task Management API Test Suite (Practical 12 CI/CD)', () => {
  // Test 1: Health check endpoint
  test('GET /api/health returns HTTP 200 and healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.services).toBeDefined();
    expect(res.body.services.server).toBe('online');
  });

  // Test 2: Root API metadata route
  test('GET / returns HTTP 200 and API metadata information', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.student).toContain('Max Patel');
    expect(res.body.endpoints).toBeDefined();
  });

  // Test 3: 404 Handler for undefined routes
  test('GET /api/nonexistent-route returns HTTP 404', async () => {
    const res = await request(app).get('/api/nonexistent-route');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  // Test 4: Protected route security (rejects unauthenticated requests)
  test('GET /tasks returns HTTP 401 when Authorization token is missing', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toContain('Access denied');
  });

  // Test 5: Validation pipeline (rejects invalid registration data)
  test('POST /register returns HTTP 400 when body is invalid', async () => {
    const res = await request(app)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
