import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import {
  createTask,
  deleteTask,
  getTaskStats,
  getTasks,
  toggleTaskStatus,
  updateTask,
} from '../controllers/taskController.js';
import { taskSchema, validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', validate(taskSchema), createTask);
router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.put('/:id', validate(taskSchema), updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', toggleTaskStatus);

export default router;
