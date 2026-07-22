// ============================================
// env.js — Environment Configuration & Validation
// ============================================
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const requiredEnv = [
  'PORT',
  'NODE_ENV',
  'FRONTEND_URL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'JWT_SECRET'
];

// Warn about missing env variables but don't hard crash the server during bootstrap
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.warn(`[WARNING] Missing environment variables: ${missing.join(', ')}`);
}

export const env = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key-replace-in-production',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY 
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
      : undefined,
  }
};

export default env;
