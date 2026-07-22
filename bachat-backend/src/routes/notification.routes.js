// ============================================
// notification.routes.js — Notifications Routes Placeholder
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
router.put('/:id/read', notImplemented);
router.put('/read-all', notImplemented);
router.delete('/', notImplemented);

export default router;
