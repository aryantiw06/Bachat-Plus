// ============================================
// auth.middleware.js — Firebase Token Verification Middleware
// ============================================
// Extracts Firebase ID Token from Authorization header,
// verifies it using Firebase Admin SDK, and attaches
// req.user for downstream route handlers.
// ============================================

import { auth } from '../config/firebase.js';
import logger from '../config/logger.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      logger.warn('Authentication failed: No token provided.', {
        event: 'auth.middleware_missing_token',
        ip: req.ip,
        path: req.originalUrl,
      });
      return res.status(401).json({
        success: false,
        message: 'Not authorized — no token provided',
      });
    }

    try {
      const decodedToken = await auth.verifyIdToken(token);

      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || null,
        name: decodedToken.name || decodedToken.displayName || null,
      };

      logger.debug('Token verified successfully.', {
        event: 'auth.middleware_verified',
        uid: req.user.uid,
      });
      next();
    } catch (verifyError) {
      logger.warn('Firebase token verification failed.', {
        event: 'auth.middleware_verification_failed',
        error: verifyError.message,
        code: verifyError.code,
      });

      let message = 'Not authorized — token is invalid or expired';
      if (verifyError.code === 'auth/id-token-expired') {
        message = 'Session expired — please sign in again';
      } else if (verifyError.code === 'auth/id-token-revoked') {
        message = 'Session revoked — please sign in again';
      } else if (verifyError.code === 'auth/argument-error') {
        message = 'Malformed token — please sign in again';
      }

      return res.status(401).json({
        success: false,
        message,
      });
    }
  } catch (error) {
    logger.error('Auth middleware unexpected error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication',
    });
  }
};

export default protect;
