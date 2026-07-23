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
app.use(helmet());

// 2. CORS setup
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
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
app.use(`${apiPrefix}/payments`, paymentRoutes);
app.use(`${apiPrefix}/analytics`, analyticsRoutes);
app.use(`${apiPrefix}/advisor`, advisorRoutes);
app.use(`${apiPrefix}/premium`, premiumRoutes);
app.use(`${apiPrefix}/notification`, notificationRoutes);
app.use(`${apiPrefix}/profile`, profileRoutes);
app.use(`${apiPrefix}/settings`, settingsRoutes);

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
app.use(notFound);
app.use(errorHandler);

export default app;
