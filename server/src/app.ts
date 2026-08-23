import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { config } from './config/index.js';
import apiRouter from './routes/index.js';
import { authenticate } from './middleware/authenticate.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiAuditLogger } from './middleware/apiAuditLogger.js';
import { createDynamicSeoHandler } from './middleware/dynamicSeo.js';

export function createApp() {
  const app = express();

  // Basic security and parsing middleware
  app.use(cors({
    origin: '*', // Allow client connections
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Logging, Audit & Authentication middleware
  app.use(requestLogger);
  app.use(authenticate);
  app.use(apiAuditLogger);

  // Mount master API routes under /api
  app.use('/api', apiRouter);

  // Serve static client assets from dist if available (Full-stack App Hosting / Production)
  const distPath = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    // Dynamic SSR Open Graph handler
    app.get('*', createDynamicSeoHandler(distPath));
  }

  // Global error handler
  app.use(errorHandler);

  return app;
}

