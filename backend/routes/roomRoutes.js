import express from 'express';

import {
  createRoom,
  deleteRoom,
  getRoomDetails,
  joinRoom,
  leaveRoom,
} from '../controllers/roomController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/create', createRoom);
router.post('/join', joinRoom);
router.post('/leave', leaveRoom);
router.get('/:id', getRoomDetails);
router.delete('/:id', deleteRoom);

export default router;
