// ============================================
// error.middleware.js — Centralized Error Handler
// ============================================
// Catches all unhandled errors thrown inside route handlers and
// returns a unified JSON error format. Displays tracebacks only in development.

import env from '../config/env.js';
import logger from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  const logMeta = {
    url: req.originalUrl,
    method: req.method,
    statusCode,
    code: err.code,
  };

  if (err.isOperational) {
    logger.warn(`API Error: ${err.message}`, logMeta);
  } else {
    logger.error(`API Error: ${err.message}`, {
      ...logMeta,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    code: err.code,
    stack: env.isProduction || err.isOperational ? undefined : err.stack,
  });
};

export default errorHandler;
