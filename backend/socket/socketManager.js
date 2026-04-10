import jwt from 'jsonwebtoken';

import Room from '../models/Room.js';
import User from '../models/User.js';

const emitSocketError = (socket, message) => {
  socket.emit('error', { message });
};

const getAuthorizedRoom = async (socket, roomId) => {
  if (!roomId) {
    emitSocketError(socket, 'Invalid room');
    return null;
  }

  const room = await Room.findById(roomId);

  if (!room) {
    emitSocketError(socket, 'Invalid room');
    return null;
  }

  const isMember = room.members.some(
    (member) => member.toString() === socket.user._id.toString()
  );

  if (!isMember) {
    emitSocketError(socket, 'Access denied');
    return null;
  }

  return room;
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

    socket.on('join-room', async ({ roomId }) => {
      try {
        const room = await getAuthorizedRoom(socket, roomId);

        if (!room) {
          return;
        }

        socket.join(roomId);
        console.log(`User ${socket.user.id} joined room ${roomId}`);

        io.to(roomId).emit('user-joined', {
          userId: socket.user.id,
          roomId,
        });
      } catch (error) {
        console.error(`join-room error: ${error.message}`);
        emitSocketError(socket, 'Invalid room');
      }
    });

    socket.on('send-message', async ({ roomId, message }) => {
      try {
        if (!message?.trim()) {
          return;
        }

        const room = await getAuthorizedRoom(socket, roomId);

        if (!room) {
          return;
        }

        io.to(roomId).emit('receive-message', {
          userId: socket.user.id,
          message: message.trim(),
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error(`send-message error: ${error.message}`);
        emitSocketError(socket, 'Failed to send message');
      }
    });

    socket.on('code-change', async ({ roomId, code }) => {
      try {
        const room = await getAuthorizedRoom(socket, roomId);

        if (!room) {
          return;
        }

        socket.to(roomId).emit('receive-code', {
          code,
          userId: socket.user.id,
        });
      } catch (error) {
        console.error(`code-change error: ${error.message}`);
        emitSocketError(socket, 'Failed to sync code');
      }
    });

    socket.on('sync-code', async ({ roomId, code }) => {
      try {
        const room = await getAuthorizedRoom(socket, roomId);

        if (!room) {
          return;
        }

        socket.to(roomId).emit('receive-code', {
          code,
          isFullSync: true,
        });
      } catch (error) {
        console.error(`sync-code error: ${error.message}`);
        emitSocketError(socket, 'Failed to sync code');
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.user._id.toString()}`);
    });
  });
};

export default initializeSocketManager;
