import dotenv from 'dotenv';

import http from 'http';
import { Server } from 'socket.io';

import app from './app.js';
import connectDB from './config/db.js';
import codeRoutes from './routes/codeRoutes.js';
import initializeSocketManager from './socket/socketManager.js';

dotenv.config();

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.use('/api/code', codeRoutes);
    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: 'http://localhost:5173',
        credentials: true,
      },
    });

    app.set('io', io);
    initializeSocketManager(io);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Server failed to start: ${error.message}`);
    process.exit(1);
  }
};

startServer();
