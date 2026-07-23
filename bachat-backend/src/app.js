// ============================================
// app.js — Express Application Configuration
// ============================================
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import env from './config/env.js';
import logger from './config/logger.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFound } from './middleware/notFound.middleware.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import walletRoutes from './routes/wallet.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import advisorRoutes from './routes/advisor.routes.js';
import premiumRoutes from './routes/premium.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import profileRoutes from './routes/profile.routes.js';
import settingsRoutes from './routes/settings.routes.js';

const app = express();

// 1. Security Headers (Helmet)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. Dynamic CORS setup for Vercel & Localhost
const allowedOrigins = [
  ...env.frontendUrl.split(',').map((origin) => origin.trim()),
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, cURL, Postman, server-to-server)
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.includes(origin) ||
                        /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin) ||
                        /^http:\/\/localhost(?::\d+)?$/i.test(origin);
                        
      if (isAllowed) {
        return callback(null, true);
      }
      
      logger.warn(`CORS blocked request from origin: ${origin}`);
      return callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

// 3. Compression (Gzip)
app.use(compression());

// 4. Morgan HTTP Request Logger
const morganFormat = env.isProduction ? 'combined' : 'dev';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// 5. Body Parsers & Cookie Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 6. Rate Limiting (Prevent DDoS / Brute Force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api/', limiter);

// ============================================
// HEALTH ENDPOINTS
// ============================================

// Base endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Bachat+ Backend',
    version: '1.0.0',
    status: 'running',
    health: '/health',
    docs: '/api/v1',
  });
});

// Detailed health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    uptime: process.uptime().toFixed(2) + 's',
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
  });
});

// ============================================
// API ROUTES (v1 versioned routing)
// ============================================
const apiPrefix = '/api/v1';

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/wallet`, walletRoutes);
app.use(`${apiPrefix}/wallets`, walletRoutes); // Plural alias
app.use(`${apiPrefix}/payments`, paymentRoutes);
app.use(`${apiPrefix}/payment`, paymentRoutes); // Singular alias
app.use(`${apiPrefix}/transactions`, paymentRoutes); // Transaction history alias
app.use(`${apiPrefix}/analytics`, analyticsRoutes);
app.use(`${apiPrefix}/advisor`, advisorRoutes);
app.use(`${apiPrefix}/premium`, premiumRoutes);
app.use(`${apiPrefix}/notification`, notificationRoutes);
app.use(`${apiPrefix}/notifications`, notificationRoutes); // Plural alias
app.use(`${apiPrefix}/profile`, profileRoutes);
app.use(`${apiPrefix}/settings`, settingsRoutes);

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
app.use(notFound);
app.use(errorHandler);

export default app;
