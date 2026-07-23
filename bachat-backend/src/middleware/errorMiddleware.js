import logger from '../utils/logger.js';

export const errorMiddleware = (err, req, res, next) => {
  logger.error(err.message || 'Internal Server Error', {
    stack: err.stack,
    path: req.originalUrl,
    method: req.method
  });

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};

export default errorMiddleware;
