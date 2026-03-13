import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validate.js';
import {
  getInquiryLogs,
  getInquiryLogById,
  createInquiryLog,
  deleteInquiryLog,
  getInquiryStats,
} from '../controllers/inquiryLogs.controller.js';

const router = Router();

// GET /api/inquiry-logs/stats  — must come BEFORE /:id
router.get('/stats', getInquiryStats);

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 200 }).toInt(),
    query('item_id').optional().isInt({ min: 1 }).toInt(),
  ],
  validate,
  getInquiryLogs
);

router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  getInquiryLogById
);

// Called by frontend right before opening Line OA
router.post(
  '/',
  [body('items').isInt({ min: 1 }).withMessage('items (item id) is required').toInt()],
  validate,
  createInquiryLog
);

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  deleteInquiryLog
);

export default router;
