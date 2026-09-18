import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/authRoutes.js';
import codeRoutes from './routes/codeRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import testRoutes from './routes/testRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const DEV_ORIGINS = ['http://localhost:5173', 'http://localhost:3000'];

const getAllowedOrigins = () => {
  const origins = [...DEV_ORIGINS];
  if (process.env.CLIENT_URL) {
    origins.push(process.env.CLIENT_URL);
  }
  return origins;
};

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, server-to-server, curl)
    if (!origin) {
      return callback(null, true);
    }
    if (getAllowedOrigins().includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
};

const app = express();

// Trust first proxy hop for rate limiters (Render/Vercel)
app.set('trust proxy', 1);

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(cors(corsOptions));

// Body Parsers
app.use(express.json({ limit: '10kb' }));

// API Routers
app.use('/api/auth', authRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/sessions', sessionRoutes);

// Root Health Check
app.use('/', testRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
