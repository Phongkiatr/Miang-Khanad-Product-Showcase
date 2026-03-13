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

const router = Router();

router.get('/', getItemTypes);

router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  getItemTypeById
);

router.post(
  '/',
  [body('name').notEmpty().withMessage('name is required').trim()],
  validate,
  createItemType
);

router.patch(
  '/:id',
  [
    param('id').isInt({ min: 1 }).toInt(),
    body('name').notEmpty().withMessage('name is required').trim(),
  ],
  validate,
  updateItemType
);

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  deleteItemType
);

export default router;
