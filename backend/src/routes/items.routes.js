import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validate.js';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/items.controller.js';

const router = Router();

// GET /api/items
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('category').optional().isInt({ min: 1 }).toInt(),
    query('search').optional().isString().trim().escape(),
  ],
  validate,
  getItems
);

// GET /api/items/:id
router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  getItemById
);

// POST /api/items
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('name is required').trim(),
    body('price').isFloat({ min: 0 }).withMessage('price must be a non-negative number'),
    body('description').optional().isString().trim(),
    body('item_type').optional().isInt({ min: 1 }).toInt(),
    body('item_var').optional().isInt({ min: 1 }).toInt(),
    body('imgsrc').optional().isURL().withMessage('imgsrc must be a valid URL'),
  ],
  validate,
  createItem
);

// PATCH /api/items/:id
router.patch(
  '/:id',
  [
    param('id').isInt({ min: 1 }).toInt(),
    body('name').optional().notEmpty().trim(),
    body('price').optional().isFloat({ min: 0 }),
    body('description').optional().isString().trim(),
    body('item_type').optional().isInt({ min: 1 }).toInt(),
    body('item_var').optional().isInt({ min: 1 }).toInt(),
    body('imgsrc').optional().isURL(),
  ],
  validate,
  updateItem
);

// DELETE /api/items/:id
router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  deleteItem
);

export default router;
