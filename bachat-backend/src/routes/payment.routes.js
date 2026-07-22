// ============================================
// payment.routes.js — Payment Routes Placeholder
// ============================================
import { Router } from 'express';

const router = Router();

const notImplemented = (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Not implemented yet',
  });
};

router.post('/process', notImplemented);
router.get('/history', notImplemented);

export default router;
