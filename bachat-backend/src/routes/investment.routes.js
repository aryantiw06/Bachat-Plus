import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as investmentController from '../controllers/investment.controller.js';

const router = Router();

router.get('/', protect, asyncHandler(investmentController.getInvestments));
router.post('/', protect, asyncHandler(investmentController.createInvestment));

export default router;
