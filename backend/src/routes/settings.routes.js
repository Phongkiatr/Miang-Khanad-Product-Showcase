import { Router } from 'express';
import * as controller from '../controllers/settings.controller.js';
import { auth } from '../middleware/auth.js';

const router = Router();

/**
 * @route   GET /api/settings
 * @desc    Get all site settings
 * @access  Public
 */
router.get('/', controller.getSettings);

/**
 * @route   PATCH /api/settings
 * @desc    Update site settings
 * @access  Private (Admin)
 */
router.patch('/', auth, controller.updateSettings);

export default router;
