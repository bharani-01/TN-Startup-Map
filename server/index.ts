import { createApp } from './src/app.js';
import { config } from './src/config/index.js';
import { logger } from './src/utils/logger.js';
import { db } from './src/database/connection.js';

const app = createApp();

async function startServer() {
  await db.connect();

  const server = app.listen(config.port, () => {
    logger.success(`🚀 TN Startup Map Server running on http://localhost:${config.port}`);
    logger.info(`📡 API Health Check available at http://localhost:${config.port}/api/health`);
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      logger.info('Server closed.');
      process.exit(0);
    });
  });
}

startServer();
