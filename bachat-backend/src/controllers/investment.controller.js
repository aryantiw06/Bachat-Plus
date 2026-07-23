// ============================================
// investment.controller.js — Investment Controllers
// ============================================
import * as investmentService from '../services/investment.service.js';
import { BadRequestError } from '../utils/errors.js';

/**
 * GET /api/v1/investments — Full Investment Bundle
 */
export const getInvestments = async (req, res) => {
  const data = await investmentService.getInvestmentBundle(req.user.uid);
  res.status(200).json(data);
};

/**
 * POST /api/v1/investments — Create Investment Order
 */
export const createInvestment = async (req, res) => {
  const { productId, investmentType, amount } = req.body || {};

  if (amount === undefined || amount === null) {
    throw new BadRequestError('Investment amount is required');
  }

  const result = await investmentService.createInvestment(req.user.uid, {
    productId,
    investmentType,
    amount,
  });

  res.status(201).json(result);
};

/**
 * POST /api/v1/investments/add-money — Add Money (Simulated Wallet Top-Up)
 */
export const addMoney = async (req, res) => {
  const { amount } = req.body || {};

  if (amount === undefined || amount === null) {
    throw new BadRequestError('Amount to add is required');
  }

  const parsedAmount = typeof amount === 'number' ? amount : parseFloat(amount);
  const result = await investmentService.addMoney(req.user.uid, parsedAmount);

  res.status(200).json(result);
};

/**
 * GET /api/v1/investments/history — User Investment History
 */
export const getInvestmentHistory = async (req, res) => {
  const history = await investmentService.getInvestmentHistory(req.user.uid);
  res.status(200).json({ success: true, investments: history });
};

/**
 * GET /api/v1/investments/portfolio — User Portfolio Summary & Analytics
 */
export const getPortfolio = async (req, res) => {
  const portfolio = await investmentService.getPortfolio(req.user.uid);
  res.status(200).json({ success: true, portfolio });
};
