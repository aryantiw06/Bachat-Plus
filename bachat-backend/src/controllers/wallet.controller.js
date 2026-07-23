// ============================================
// wallet.controller.js — Wallet Controllers
// ============================================
import * as walletService from '../services/wallet.service.js';
import * as analyticsService from '../services/analytics.service.js';
import env from '../config/env.js';
import { AppError } from '../utils/errors.js';

/**
 * GET /api/v1/wallet
 */
export const getWallet = async (req, res) => {
  const summary = await walletService.getWalletSummary(req.user.uid);
  res.status(200).json(summary);
};

/**
 * POST /api/v1/wallet/reset
 * Development-only endpoint to reset wallet and analytics totals.
 */
export const resetWallet = async (req, res) => {
  if (env.isProduction) {
    throw new AppError('Wallet reset is only available in development', 403, 'FORBIDDEN');
  }

  const wallet = await walletService.resetWallet(req.user.uid);
  await analyticsService.resetAnalyticsPaymentStats(req.user.uid);

  res.status(200).json({
    success: true,
    message: 'Wallet and analytics totals reset',
    wallet,
  });
};
