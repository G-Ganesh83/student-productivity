import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import {
  codeRunSchema,
  loginSchema,
  registerSchema,
  resourceSchema,
  roomSchema,
  sessionSchema,
  taskSchema,
} from '../middleware/validateMiddleware.js';

// Load env vars before importing app
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_ci';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test-student-productivity';

/**
 * API Integration Tests for LEARN EASY Backend
 *
 * These tests validate:
 *   1. Health check endpoint
 *   2. Authentication route guards
 *   3. Zod request validation on mutation endpoints
 *   4. Code execution authentication guard
 *   5. 404 handler for undefined routes
 */

let app;

beforeAll(async () => {
  // Dynamically import app to ensure env vars are set first
  const appModule = await import('../app.js');
  app = appModule.default;
});

// ─── 1. Health Check ──────────────────────────────────────────────────────────

describe('GET / (Health Check)', () => {
  it('should return 200 and a running message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('API is running');
  });
});

// ─── 2. Authentication Guards ─────────────────────────────────────────────────

describe('Authentication Guards', () => {
  it('POST /api/tasks should return 401 without a token', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/tasks should return 401 without a token', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(401);
  });

  it('POST /api/code/run should return 401 without a token', async () => {
    const res = await request(app)
      .post('/api/code/run')
      .send({ language: 'python', code: 'print(1)' });
    expect(res.status).toBe(401);
  });

  it('GET /api/rooms should return 401 without a token', async () => {
    const res = await request(app).get('/api/rooms');
    expect(res.status).toBe(401);
  });

  it('GET /api/resources should return 401 without a token', async () => {
    const res = await request(app).get('/api/resources');
    expect(res.status).toBe(401);
  });

  it('GET /api/sessions/daily-summary should return 401 without a token', async () => {
    const res = await request(app).get('/api/sessions/daily-summary');
    expect(res.status).toBe(401);
  });

  it('should return 401 with an invalid token', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', 'Bearer invalid.token.here');
    expect(res.status).toBe(401);
  });

  it('should return 401 with an expired token', async () => {
    const expiredToken = jwt.sign(
      { id: '65f000000000000000000001' },
      process.env.JWT_SECRET,
      { expiresIn: '0s' }
    );

    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
  });
});

// ─── 3. Zod Request Validation ────────────────────────────────────────────────

describe('Zod Request Validation', () => {
  it('POST /api/code/run with empty body should return 400', async () => {
    const res = await request(app)
      .post('/api/code/run')
      .send({});

    // Rate limiter → validate → authMiddleware → controller
    // Validation runs before auth on this route
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('POST /api/auth/register with invalid email should return 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'not-an-email', password: '123456' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/register with password shorter than 6 chars should return 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'valid@example.com', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login with missing password should return 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login with invalid email should return 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid-email', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  describe('Zod Schema Definitions', () => {
    it('taskSchema should reject empty title and accept valid title', () => {
      const invalid = taskSchema.safeParse({ title: '' });
      expect(invalid.success).toBe(false);

      const valid = taskSchema.safeParse({ title: 'Complete homework', priority: 'high' });
      expect(valid.success).toBe(true);
    });

    it('roomSchema should reject empty object and accept valid room details', () => {
      const invalid = roomSchema.safeParse({});
      expect(invalid.success).toBe(false);

      const valid = roomSchema.safeParse({ name: 'Algorithms Study Group' });
      expect(valid.success).toBe(true);
    });

    it('sessionSchema should reject empty object and accept valid session', () => {
      const invalid = sessionSchema.safeParse({});
      expect(invalid.success).toBe(false);

      const valid = sessionSchema.safeParse({ taskId: '123', duration: 25 });
      expect(valid.success).toBe(true);
    });

    it('resourceSchema should validate title, url, and type fields', () => {
      const invalid = resourceSchema.safeParse({ title: 'Doc' });
      expect(invalid.success).toBe(false);

      const valid = resourceSchema.safeParse({
        title: 'React Docs',
        url: 'https://react.dev',
        type: 'documentation',
      });
      expect(valid.success).toBe(true);
    });
  });
});

// ─── 4. Code Execution Security ───────────────────────────────────────────────

describe('Code Execution Security', () => {
  it('POST /api/code/run should reject unauthenticated requests', async () => {
    const res = await request(app)
      .post('/api/code/run')
      .send({ language: 'python', code: 'import os; os.system("ls")' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/code/run should validate empty payload before auth', async () => {
    const res = await request(app)
      .post('/api/code/run')
      .send({});

    // Validation middleware runs before auth on code routes
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

// ─── 5. 404 Handler ──────────────────────────────────────────────────────────

describe('404 Not Found Handler', () => {
  it('should return 404 for undefined routes', async () => {
    const res = await request(app).get('/api/nonexistent-route');
    expect(res.status).toBe(404);
  });

  it('should return 404 for undefined API sub-routes', async () => {
    const res = await request(app).get('/api/foo/bar/baz');
    expect(res.status).toBe(404);
  });
});

// ─── 6. CORS & Security Headers ──────────────────────────────────────────────

describe('Security Headers', () => {
  it('should include helmet security headers', async () => {
    const res = await request(app).get('/');

    // Helmet sets various security headers
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBeDefined();
  });

  it('should reject requests with invalid CORS origin', async () => {
    const res = await request(app)
      .get('/')
      .set('Origin', 'https://evil-site.com');

    // Express CORS middleware returns the response but without CORS headers,
    // or throws an error depending on configuration
    // Our config calls callback with an error for disallowed origins
    expect(res.status).toBe(500);
  });

  it('should accept requests from allowed dev origins', async () => {
    const res = await request(app)
      .get('/')
      .set('Origin', 'http://localhost:5173');

    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });
});
