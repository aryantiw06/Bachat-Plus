import { Router } from 'express';
import { createPayment, getPayments, getPaymentById } from '../controllers/paymentController.js';

const router = Router();

router.post('/', createPayment);
router.get('/', getPayments);
router.get('/:id', getPaymentById);

export default router;
