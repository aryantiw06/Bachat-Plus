// ============================================
// wallet.routes.js — Wallet Routes
// ============================================
import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as walletController from '../controllers/wallet.controller.js';

const router = Router();

router.get('/', protect, asyncHandler(walletController.getWallet));
router.post('/reset', protect, asyncHandler(walletController.resetWallet));

export default router;
