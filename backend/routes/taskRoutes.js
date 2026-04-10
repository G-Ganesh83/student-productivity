import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import {
  createTask,
  deleteTask,
  getTasks,
  toggleTaskStatus,
  updateTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', toggleTaskStatus);

export default router;
