// ============================================
// profile.routes.js — Profile Routes Placeholder
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
router.put('/update', notImplemented);
router.post('/export', notImplemented);

export default router;
