// ============================================
// payment.routes.js — Payment Routes
// ============================================
import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as paymentController from '../controllers/payment.controller.js';

const router = Router();

router.post('/', protect, asyncHandler(paymentController.createPayment));
router.get('/', protect, asyncHandler(paymentController.getPaymentHistory));
router.get('/:id', protect, asyncHandler(paymentController.getPaymentById));

export default router;
