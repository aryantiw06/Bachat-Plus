import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authMiddleware from './src/middleware/authMiddleware.js';
import errorMiddleware from './src/middleware/errorMiddleware.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import walletRoutes from './src/routes/walletRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.send('Bachat+ backend is running ✅');
});

// Mounted Phase 9C Routes with Auth Protection
app.use('/api/v1/payments', authMiddleware, paymentRoutes);
app.use('/api/v1/wallet', authMiddleware, walletRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Export app for testing purposes
export { app };

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;