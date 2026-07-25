// ============================================
// server.js — Server Bootstrap Entrypoint
// ============================================
import './config/tracing.js';
import app from './app.js';
import env from './config/env.js';
import logger from './config/logger.js';

const PORT = env.port;

const server = app.listen(PORT, () => {
  logger.info(`Server running in [${env.nodeEnv}] mode on port: ${PORT}`);
  logger.info(`Base URL: http://localhost:${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
});

// Handle graceful shutdown and unhandled promise rejections
const handleGracefulShutdown = (signal) => {
  logger.warn(`Received ${signal}. Shutting down server gracefully...`);
  server.close(() => {
    logger.info('Http server closed.');
    process.exit(0);
  });

  // Force close after 10s if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection detected:', reason);
  // Extensible: can report error to monitoring/logging services here
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception thrown:', error);
  // Exit gracefully since node process might be in an unstable state
  process.exit(1);
});
