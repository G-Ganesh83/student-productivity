import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import {
  endSession,
  getDailySummary,
  getTaskInsights,
  getWeeklySummary,
  startSession,
} from '../controllers/sessionController.js';
import { sessionSchema, validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/daily-summary', getDailySummary);
router.get('/weekly-summary', getWeeklySummary);
router.get('/task-insights', getTaskInsights);
router.post('/start', validate(sessionSchema), startSession);
router.post('/end', validate(sessionSchema), endSession);

export default router;
