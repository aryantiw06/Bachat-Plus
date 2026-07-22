// ============================================
// advisor.routes.js — AI Advisor Routes Placeholder
// ============================================
import { Router } from 'express';

const router = Router();

const notImplemented = (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Not implemented yet',
  });
};

router.get('/insights', notImplemented);
router.get('/recommendations', notImplemented);

export default router;
