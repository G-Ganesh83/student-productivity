import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import { codeExecutionLimiter } from '../middleware/rateLimiter.js';
import { codeRunSchema, validate } from '../middleware/validateMiddleware.js';
import { runCode } from '../controllers/codeController.js';

const router = express.Router();

router.post('/run', codeExecutionLimiter, validate(codeRunSchema), authMiddleware, runCode);

export default router;
