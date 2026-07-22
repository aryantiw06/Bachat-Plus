// ============================================
// asyncHandler.js — Async Route Handler Wrapper
// ============================================
// Catches rejected promises from async route handlers and
// forwards them to the centralized error middleware.

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
