// ============================================
// auth.controller.js — Authentication Controllers
// ============================================
import * as authService from '../services/auth.service.js';
import { UnauthorizedError } from '../utils/errors.js';
import logger from '../config/logger.js';

/**
 * POST /api/v1/auth/session
 * Verify Firebase ID token and bootstrap user data.
 */
export const createSession = async (req, res) => {
  const token = authService.extractBearerToken(req.headers.authorization);

  if (!token) {
    logger.warn('Session request rejected — missing Authorization header.', {
      event: 'auth.missing_token',
      ip: req.ip,
    });
    throw new UnauthorizedError('Not authorized — no token provided');
  }

  const bootstrap = await authService.establishSession(token);
  res.status(200).json(bootstrap);
};

/**
 * GET /api/v1/auth/me
 * Return current authenticated user data.
 */
export const getMe = async (req, res) => {
  const bootstrap = await authService.getCurrentUser(req.user.uid);
  res.status(200).json(bootstrap);
};

/**
 * POST /api/v1/auth/logout
 * Revoke refresh tokens and end server-side session.
 */
export const logout = async (req, res) => {
  const result = await authService.logout(req.user.uid);
  res.status(200).json(result);
};
