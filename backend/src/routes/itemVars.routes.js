import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import {
  getItemVars,
  getItemVarById,
  createItemVar,
  updateItemVar,
  deleteItemVar,
} from '../controllers/itemVars.controller.js';

/**
 * ItemVars Routes
 * Defines endpoints for product variant management.
 */

const router = Router();

// GET /api/item-vars - Fetch all variants
router.get('/', getItemVars);

// GET /api/item-vars/:id - Fetch variant details
router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  getItemVarById
);

// POST /api/item-vars - Create variant
router.post(
  '/',
  auth,
  [
    body('color').optional().isString().trim(),
    body('ssize').optional().isString().trim(),
    body('tsize').optional().isString().trim(),
  ],
  validate,
  createItemVar
);

// PATCH /api/item-vars/:id - Update variant
router.patch(
  '/:id',
  auth,
  [
    param('id').isInt({ min: 1 }).toInt(),
    body('color').optional().isString().trim(),
    body('ssize').optional().isString().trim(),
    body('tsize').optional().isString().trim(),
  ],
  validate,
  updateItemVar
);

// DELETE /api/item-vars/:id - Remove variant
router.delete(
  '/:id',
  auth,
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  deleteItemVar
);

export default router;
