import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import testRoutes from './routes/testRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

export default app;
