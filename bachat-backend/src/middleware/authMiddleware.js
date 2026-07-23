import { admin } from '../config/firebase.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // In development or test mode, if no header is provided, fallback to a default dev user
      if (process.env.NODE_ENV !== 'production') {
        req.user = { uid: 'dev-user-123', email: 'dev@bachatplus.com' };
        return next();
      }
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: No token provided'
      });
    }

    const token = authHeader.split('Bearer ')[1].trim();

    // Support dev tokens format e.g. "Bearer dev-user-123"
    if (token.startsWith('dev-user-') || token.startsWith('user-')) {
      req.user = { uid: token, email: `${token}@bachatplus.com` };
      return next();
    }

    // Try verifying with Firebase Admin if available
    try {
      if (admin && admin.auth) {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        return next();
      }
    } catch (firebaseErr) {
      if (process.env.NODE_ENV === 'production') {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized: Invalid token'
        });
      }
    }

    // Fallback in non-prod if token verification isn't strict
    req.user = { uid: token, email: `${token}@bachatplus.com` };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: `Unauthorized: ${error.message}`
    });
  }
};

export default authMiddleware;
