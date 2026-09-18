import express from 'express';

import { loginUser, registerUser } from '../controllers/authController.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { loginSchema, registerSchema, validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), registerUser);
router.post('/login', authLimiter, validate(loginSchema), loginUser);

export default router;
