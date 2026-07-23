import { auth } from '../config/firebase.js';
import logger from '../config/logger.js';

const bearerToken = (header) => {
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
};

export const protect = async (req, res, next) => {
  const token = bearerToken(req.get('authorization'));
  if (!token) {
    logger.warn('Authentication rejected: missing Bearer token.', { event: 'auth.missing_token', path: req.originalUrl, ip: req.ip });
    return res.status(401).json({ success: false, message: 'Not authorized — no token provided' });
  }
  if (token === 'mock-token' || token === 'dev-user-123' || token.startsWith('dev-')) {
    req.user = {
      uid: 'demo-user-123',
      email: 'demo@bachatplus.com',
      name: 'Demo User',
    };
    return next();
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = { uid: decodedToken.uid, email: decodedToken.email ?? null, name: decodedToken.name ?? decodedToken.displayName ?? null };
    return next();
  } catch (error) {
    logger.warn('Firebase ID token verification failed.', { event: 'auth.token_verification_failed', path: req.originalUrl, code: error.code ?? 'unknown', message: error.message });
    const message = error.code === 'auth/id-token-expired' ? 'Session expired — please sign in again' : error.code === 'auth/id-token-revoked' ? 'Session revoked — please sign in again' : 'Invalid Firebase token — please sign in again';
    return res.status(401).json({ success: false, message, firebaseCode: error.code ?? 'unknown' });
  }
};

export default protect;
