// ============================================
// payment.controller.js — Payment Controllers
// ============================================
import * as paymentService from '../services/payment.service.js';
import { BadRequestError } from '../utils/errors.js';

/**
 * POST /api/v1/payments (or /api/v1/payment)
 */
export const createPayment = async (req, res) => {
  const { amount, merchant, merchantName, category } = req.body || {};

  const paymentAmount = amount !== undefined && amount !== null ? amount : req.body.purchaseAmount;
  const paymentMerchant = merchant || merchantName;

  if (paymentAmount === undefined || paymentAmount === null) {
    throw new BadRequestError('Amount is required');
  }

  const parsedAmount = typeof paymentAmount === 'number' ? paymentAmount : parseFloat(paymentAmount);

  const result = await paymentService.createPayment(req.user.uid, {
    amount: parsedAmount,
    merchant: paymentMerchant,
    category,
  });

  res.status(201).json(result);
};

/**
 * GET /api/v1/payments (or /api/v1/payment)
 */
export const getPaymentHistory = async (req, res) => {
  const result = await paymentService.getPaymentHistory(req.user.uid, req.query);
  res.status(200).json(result);
};

// Export alias for controller naming consistency
export const getPayments = getPaymentHistory;

/**
 * GET /api/v1/payments/:id
 */
export const getPaymentById = async (req, res) => {
  const transaction = await paymentService.getPaymentById(req.user.uid, req.params.id);
  res.status(200).json({ success: true, transaction });
};
