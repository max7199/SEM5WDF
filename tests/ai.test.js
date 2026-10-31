// =============================================================================
// Practical 13: AI API Integration into a Web Application
// File: tests/ai.test.js
// Description: Automated integration and unit tests for AI description generation,
//              validation rules, graceful error fallback, and rate limiting.
// Student: Max Patel (24IT070) - CHARUSAT - ITUE301
// =============================================================================

import request from 'supertest';
import app from '../app.js';
import { clearRateLimitStore } from '../services/aiService.js';

describe('Practical 13: AI API Integration Test Suite', () => {
  beforeEach(() => {
    // Clear in-memory rate limiting store before each test
    clearRateLimitStore();
  });

  // Test 1: Reject missing title
  test('POST /api/ai/generate-description returns HTTP 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/ai/generate-description')
      .set('Content-Type', 'application/json')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toContain('Task title is required');
  });

  // Test 2: Reject empty whitespace title
  test('POST /api/ai/generate-description returns HTTP 400 when title is whitespace only', async () => {
    const res = await request(app)
      .post('/api/ai/generate-description')
      .set('Content-Type', 'application/json')
      .send({ title: '    ' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toContain('Task title is required');
  });

  // Test 3: Reject excessively long title (> 200 characters)
  test('POST /api/ai/generate-description returns HTTP 400 when title exceeds 200 characters', async () => {
    const longTitle = 'A'.repeat(205);
    const res = await request(app)
      .post('/api/ai/generate-description')
      .set('Content-Type', 'application/json')
      .send({ title: longTitle });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toContain('too long');
  });

  // Test 4: Graceful fallback when API key is missing or unconfigured
  test('POST /api/ai/generate-description returns graceful fallback when provider key is unconfigured', async () => {
    // With default placeholder OPENAI_API_KEY, the service safely degrades
    const res = await request(app)
      .post('/api/ai/generate-description')
      .set('Content-Type', 'application/json')
      .send({
        title: 'Prepare final project report',
        clientId: 'test-client-fallback'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.fallback).toBe(true);
    expect(res.body.description).toBe('');
    expect(res.body.message).toContain('AI suggestions are temporarily unavailable');
  });

  // Test 5: In-Memory Rate Limiting enforcement (1 request per task per minute)
  test('POST /api/ai/generate-description returns HTTP 429 when duplicate request made within 1 minute', async () => {
    const testTaskId = 'test-rate-limit-task-123';

    // First request: succeeds / returns fallback
    const firstRes = await request(app)
      .post('/api/ai/generate-description')
      .set('Content-Type', 'application/json')
      .send({
        title: 'Review MongoDB indexes',
        taskId: testTaskId
      });

    expect([200, 429]).toContain(firstRes.statusCode);

    // Immediate second request for identical task ID: must be rate-limited
    const secondRes = await request(app)
      .post('/api/ai/generate-description')
      .set('Content-Type', 'application/json')
      .send({
        title: 'Review MongoDB indexes',
        taskId: testTaskId
      });

    expect(secondRes.statusCode).toBe(429);
    expect(secondRes.body.rateLimited).toBe(true);
    expect(secondRes.body.error).toContain('Please wait one minute');
    expect(secondRes.body.retryAfter).toBeGreaterThan(0);
  });

  // Test 6: Rate limit isolation (different task IDs can request independently)
  test('POST /api/ai/generate-description allows requests for different task identifiers', async () => {
    // Request for Task A
    const resA = await request(app)
      .post('/api/ai/generate-description')
      .set('Content-Type', 'application/json')
      .send({
        title: 'Implement unit tests',
        taskId: 'task-alpha-001'
      });

    expect(resA.statusCode).toBe(200);

    // Request for Task B (different ID) - should not be blocked by Task A
    const resB = await request(app)
      .post('/api/ai/generate-description')
      .set('Content-Type', 'application/json')
      .send({
        title: 'Configure Docker container',
        taskId: 'task-beta-002'
      });

    expect(resB.statusCode).toBe(200);
  });
});
