import 'dotenv/config';
import validateEnv from './config/validateEnv.js';

validateEnv();

import http from 'http';
import { Server } from 'socket.io';

import app, { corsOptions } from './app.js';
import connectDB from './config/db.js';
import initializeSocketManager from './socket/socketManager.js';

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);

    const io = new Server(server, {
      cors: corsOptions,
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
