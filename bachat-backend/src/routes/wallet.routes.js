// ============================================
// wallet.routes.js — Wallet Routes Placeholder
// ============================================
import { Router } from 'express';

const router = Router();

const notImplemented = (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Not implemented yet',
  });
};

router.get('/', notImplemented);
router.post('/sync', notImplemented);
router.post('/goal', notImplemented);

export default router;
