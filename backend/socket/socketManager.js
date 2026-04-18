import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import Room from '../models/Room.js';
import User from '../models/User.js';

const emitSocketError = (socket, message, code) => {
  socket.emit('socket-error', { message, code });
};

async function validateRoomAccess(roomId, userId) {
  if (!roomId) {
    return { valid: false, error: 'Room ID is required', code: 'INVALID_INPUT' };
  }

  const room = await Room.findById(roomId);

  if (!room) {
    return { valid: false, error: 'Room not found', code: 'ROOM_NOT_FOUND' };
  }

  const isMember = room.members.some(
    (member) => member.toString() === userId.toString()
  );

  if (!isMember) {
    return { valid: false, error: 'Access denied', code: 'UNAUTHORIZED' };
  }

  return { valid: true };
}

const resolveRoomAccess = async (socket, roomId) => {
  const result = await validateRoomAccess(roomId, socket.user._id);

  if (!result.valid) {
    emitSocketError(socket, result.error, result.code);
    return false;
  }

  return true;
};

const initializeSocketManager = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        console.error('Socket authentication failed: No token provided');
        return next(new Error('Invalid token'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        console.error('Socket authentication failed: User not found');
        return next(new Error('Invalid token'));
      }

      socket.user = user;
      next();
    } catch (error) {
      console.error(`Socket authentication failed: ${error.message}`);
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.user._id.toString()}`);

    socket.on('join-room', async (payload = {}) => {
      try {
        const { roomId } = payload;

        if (!mongoose.Types.ObjectId.isValid(roomId)) {
          emitSocketError(socket, 'Room not found', 'ROOM_NOT_FOUND');
          return;
        }

        const hasAccess = await resolveRoomAccess(socket, roomId);

        if (!hasAccess) {
          return;
        }

        if (socket.rooms.has(roomId)) {
          return;
        }

        socket.join(roomId);
        console.log(`[JOIN] user ${socket.user.id} -> room ${roomId}`);

        io.to(roomId).emit('user-joined', {
          userId: socket.user.id,
          roomId,
        });
      } catch (error) {
        console.error('Socket Error:', error.message);
        emitSocketError(socket, 'Failed to join room', 'INVALID_INPUT');
      }
    });

    socket.on('send-message', async (payload = {}) => {
      try {
        const { roomId, message } = payload;

        if (!roomId) {
          emitSocketError(socket, 'Room ID is required', 'INVALID_INPUT');
          return;
        }

        if (!message?.trim()) {
          return;
        }

        const hasAccess = await resolveRoomAccess(socket, roomId);

        if (!hasAccess) {
          return;
        }

        console.log(`[MSG] ${socket.user.id} in ${roomId}`);

        io.to(roomId).emit('receive-message', {
          userId: socket.user.id,
          message: message.trim(),
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Socket Error:', error.message);
        emitSocketError(socket, 'Failed to send message', 'INVALID_INPUT');
      }
    });

    socket.on('code-change', async (payload = {}) => {
      try {
        const { roomId, code } = payload;

        if (!roomId) {
          emitSocketError(socket, 'Room ID is required', 'INVALID_INPUT');
          return;
        }

        if (code === undefined) {
          return;
        }

        const hasAccess = await resolveRoomAccess(socket, roomId);

        if (!hasAccess) {
          return;
        }

        console.log(`[CODE] ${socket.user.id} updated code in ${roomId}`);

        socket.to(roomId).emit('receive-code', {
          code,
          userId: socket.user.id,
        });
      } catch (error) {
        console.error('Socket Error:', error.message);
        emitSocketError(socket, 'Failed to sync code', 'INVALID_INPUT');
      }
    });

    socket.on('sync-code', async (payload = {}) => {
      try {
        const { roomId, code } = payload;

        if (!roomId) {
          emitSocketError(socket, 'Room ID is required', 'INVALID_INPUT');
          return;
        }

        if (code === undefined) {
          return;
        }

        const hasAccess = await resolveRoomAccess(socket, roomId);

        if (!hasAccess) {
          return;
        }

        console.log(`[CODE] ${socket.user.id} updated code in ${roomId}`);

        socket.to(roomId).emit('receive-code', {
          code,
          userId: socket.user.id,
          isFullSync: true,
        });
      } catch (error) {
        console.error('Socket Error:', error.message);
        emitSocketError(socket, 'Failed to sync code', 'INVALID_INPUT');
      }
    });

    socket.on('code-output', async (payload = {}) => {
      try {
        const { roomId, output } = payload;

        if (!roomId) {
          emitSocketError(socket, 'Room ID is required', 'INVALID_INPUT');
          return;
        }

        if (output === undefined) {
          return;
        }

        const hasAccess = await resolveRoomAccess(socket, roomId);

        if (!hasAccess) {
          return;
        }

        socket.to(roomId).emit('receive-output', output);
      } catch (error) {
        console.error('Socket Error:', error.message);
        emitSocketError(socket, 'Failed to sync output', 'INVALID_INPUT');
      }
    });

    socket.on('disconnect', () => {
      console.log(`[DISCONNECT] user ${socket.user?.id}`);
    });
  });
};

export default initializeSocketManager;
