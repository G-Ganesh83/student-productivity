import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import {
  endSession,
  getDailySummary,
  getTaskInsights,
  getWeeklySummary,
  startSession,
} from '../controllers/sessionController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/daily-summary', getDailySummary);
router.get('/weekly-summary', getWeeklySummary);
router.get('/task-insights', getTaskInsights);
router.post('/start', startSession);
router.post('/end', endSession);

export default router;
