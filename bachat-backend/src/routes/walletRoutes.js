import { Router } from 'express';
import { getWallet, resetWallet } from '../controllers/walletController.js';

const router = Router();

router.get('/', getWallet);
router.post('/reset', resetWallet);

export default router;
