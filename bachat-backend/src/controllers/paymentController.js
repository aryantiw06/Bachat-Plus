import paymentService from '../services/paymentService.js';

export const createPayment = async (req, res, next) => {
  try {
    const { amount, merchant, category } = req.body || {};
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: User missing'
      });
    }

    // Validation checks
    if (amount === undefined || amount === null) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: amount is required'
      });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: amount must be a valid number'
      });
    }

    if (numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: amount must be greater than 0'
      });
    }

    if (!merchant || typeof merchant !== 'string' || merchant.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: merchant is required and cannot be empty'
      });
    }

    const result = await paymentService.processPayment({
      userId,
      amount: numericAmount,
      merchant,
      category
    });

    return res.status(201).json({
      success: true,
      transaction: result.transaction,
      wallet: result.wallet
    });
  } catch (error) {
    next(error);
  }
};

export const getPayments = async (req, res, next) => {
  try {
    const userId = req.user?.uid;
    const { page = 1, limit = 10 } = req.query;

    const result = await paymentService.getTransactions({
      userId,
      page,
      limit
    });

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const userId = req.user?.uid;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Transaction ID parameter is required'
      });
    }

    const transaction = await paymentService.getTransactionById({
      userId,
      transactionId: id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    return res.status(200).json({
      success: true,
      transaction
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createPayment,
  getPayments,
  getPaymentById
};
