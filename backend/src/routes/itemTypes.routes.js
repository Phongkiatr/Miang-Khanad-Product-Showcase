import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import {
  getItemTypes,
  getItemTypeById,
  createItemType,
  updateItemType,
  deleteItemType,
} from '../controllers/itemTypes.controller.js';

/**
 * ItemTypes Routes
 * Defines endpoints for category management.
 */

const router = Router();

// GET /api/item-types - Fetch all categories
router.get('/', getItemTypes);

// GET /api/item-types/:id - Fetch category details
router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  getItemTypeById
);

// POST /api/item-types - Create category
router.post(
  '/',
  [body('name').notEmpty().withMessage('name is required').trim()],
  validate,
  createItemType
);

// PATCH /api/item-types/:id - Update category
router.patch(
  '/:id',
  [
    param('id').isInt({ min: 1 }).toInt(),
    body('name').notEmpty().withMessage('name is required').trim(),
  ],
  validate,
  updateItemType
);

// DELETE /api/item-types/:id - Remove category
router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  deleteItemType
);

export default router;
