import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import apiRouter from './routes/index.js';
import { authenticate } from './middleware/authenticate.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // Basic security and parsing middleware
  app.use(cors({
    origin: '*', // Allow client connections
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Logging & Authentication middleware
  app.use(requestLogger);
  app.use(authenticate);

  // Mount master API routes under /api
  app.use('/api', apiRouter);

  // Global error handler
  app.use(errorHandler);

  return app;
}
