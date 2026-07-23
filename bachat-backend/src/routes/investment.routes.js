// ============================================
// investment.routes.js — Investment Routes
// ============================================
import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as investmentController from '../controllers/investment.controller.js';

const router = Router();

// Full bundle & investment creation
router.get('/', protect, asyncHandler(investmentController.getInvestments));
router.post('/', protect, asyncHandler(investmentController.createInvestment));

// Add Money (Simulated Wallet Top-Up)
router.post('/add-money', protect, asyncHandler(investmentController.addMoney));

// Portfolio & History endpoints
router.get('/history', protect, asyncHandler(investmentController.getInvestmentHistory));
router.get('/portfolio', protect, asyncHandler(investmentController.getPortfolio));

export default router;
