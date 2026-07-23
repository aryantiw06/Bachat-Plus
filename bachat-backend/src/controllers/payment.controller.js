// ============================================
// payment.controller.js — Payment Controllers
// ============================================
import * as paymentService from '../services/payment.service.js';
import { BadRequestError } from '../utils/errors.js';

/**
 * POST /api/v1/payments
 */
export const createPayment = async (req, res) => {
  const { amount, merchant, category } = req.body;

  if (amount === undefined || amount === null) {
    throw new BadRequestError('Amount is required');
  }

  const parsedAmount = typeof amount === 'number' ? amount : parseFloat(amount);

  const result = await paymentService.createPayment(req.user.uid, {
    amount: parsedAmount,
    merchant,
    category,
  });

  res.status(201).json(result);
};

/**
 * GET /api/v1/payments
 */
export const getPaymentHistory = async (req, res) => {
  const result = await paymentService.getPaymentHistory(req.user.uid, req.query);
  res.status(200).json(result);
};

/**
 * GET /api/v1/payments/:id
 */
export const getPaymentById = async (req, res) => {
  const transaction = await paymentService.getPaymentById(req.user.uid, req.params.id);
  res.status(200).json({ success: true, transaction });
};
