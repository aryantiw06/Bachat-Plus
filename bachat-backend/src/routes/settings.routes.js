// ============================================
// settings.routes.js — Settings Preferences Placeholder
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

export default router;
