import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { login } from '../controllers/auth.controller.js';

const router = Router();

/**
 * Auth Routes
 * Handles administrative login.
 */

// POST /api/auth/login
router.post(
  '/login',
  [
    body('password').notEmpty().withMessage('password is required')
  ],
  validate,
  login
);

export default router;
