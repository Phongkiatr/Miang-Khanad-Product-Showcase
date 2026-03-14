import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/items.controller.js';

/**
 * Items Routes
 * Defines endpoints for product management including CRUD operations and search.
 */

const router = Router();

// GET /api/items - Fetch products with filtering and pagination
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

// GET /api/items/:id - Fetch a single product by ID
router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  getItemById
);

// POST /api/items - Create a new product (Admin)
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
  auth,
  validate,
  createItem
);

// PATCH /api/items/:id - Update an existing product (Admin)
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
  auth,
  validate,
  updateItem
);

// DELETE /api/items/:id - Remove a product (Admin)
router.delete(
  '/:id',
  auth,
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  deleteItem
);

export default router;
