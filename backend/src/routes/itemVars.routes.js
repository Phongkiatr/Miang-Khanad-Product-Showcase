import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import {
  getItemVars,
  getItemVarById,
  createItemVar,
  updateItemVar,
  deleteItemVar,
} from '../controllers/itemVars.controller.js';

const router = Router();

router.get('/', getItemVars);

router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  getItemVarById
);

router.post(
  '/',
  [
    body('color').optional().isString().trim(),
    body('ssize').optional().isString().trim(),
    body('tsize').optional().isString().trim(),
  ],
  validate,
  createItemVar
);

router.patch(
  '/:id',
  [
    param('id').isInt({ min: 1 }).toInt(),
    body('color').optional().isString().trim(),
    body('ssize').optional().isString().trim(),
    body('tsize').optional().isString().trim(),
  ],
  validate,
  updateItemVar
);

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  deleteItemVar
);

export default router;
