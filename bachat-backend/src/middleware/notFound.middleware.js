// ============================================
// notFound.middleware.js — 404 Endpoint Handler
// ============================================
// Catches requests to endpoints that do not exist and routes them
// to the central error middleware with a 404 status.

import logger from '../config/logger.js';

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  logger.warn(`404 Route Not Found: ${req.method} ${req.originalUrl}`);
  next(error);
};

export default notFound;
