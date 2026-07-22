// ============================================
// auth.routes.js — Authentication Routes
// ============================================
import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

// POST /api/v1/auth/session — Verify token & bootstrap user
router.post('/session', asyncHandler(authController.createSession));

// GET /api/v1/auth/me — Get current authenticated user
router.get('/me', protect, asyncHandler(authController.getMe));

// POST /api/v1/auth/logout — End session
router.post('/logout', protect, asyncHandler(authController.logout));

export default router;
