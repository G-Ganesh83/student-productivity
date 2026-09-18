import { rateLimit } from 'express-rate-limit';

/**
 * Rate limiter for authentication endpoints (login, register).
 * Enforces a maximum of 10 requests per 15-minute window per IP to prevent brute-force attacks.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts from this IP, please try again after 15 minutes',
  },
});

/**
 * Rate limiter for code execution endpoints (/api/code/run).
 * Enforces a maximum of 10 requests per 1-minute window per IP to prevent DoS and runner exhaustion.
 */
export const codeExecutionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many code execution requests from this IP, please try again in a minute',
  },
});
