import express from 'express';

import {
  createRoom,
  deleteRoom,
  getRoomDetails,
  getUserRooms,
  joinRoom,
  leaveRoom,
} from '../controllers/roomController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { roomSchema, validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getUserRooms);
router.post('/create', validate(roomSchema), createRoom);
router.post('/join', validate(roomSchema), joinRoom);
router.post('/:id/leave', leaveRoom);
router.post('/leave', leaveRoom);
router.get('/:id', getRoomDetails);
router.delete('/:id', deleteRoom);

export default router;
