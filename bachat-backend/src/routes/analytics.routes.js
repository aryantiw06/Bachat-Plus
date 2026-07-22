// ============================================
// analytics.routes.js — Analytics Routes Placeholder
// ============================================
import { Router } from 'express';

const router = Router();

const notImplemented = (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Not implemented yet',
  });
};

router.get('/overview', notImplemented);
router.get('/spending-by-category', notImplemented);
router.get('/savings-trend', notImplemented);

export default router;
