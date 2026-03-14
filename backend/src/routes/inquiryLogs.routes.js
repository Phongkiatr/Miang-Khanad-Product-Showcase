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

/**
 * InquiryLogs Routes
 * Defines endpoints for tracking customer inquiries and statistics.
 */

const router = Router();

// GET /api/inquiry-logs/stats - Fetch summary statistics
// (Must be defined before /:id to avoid conflict)
router.get('/stats', getInquiryStats);

// GET /api/inquiry-logs - Fetch logs with pagination/filtering
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

// GET /api/inquiry-logs/:id - Fetch log details
router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  getInquiryLogById
);

// POST /api/inquiry-logs - Record a new inquiry (called upon LINE click)
router.post(
  '/',
  [body('items').isInt({ min: 1 }).withMessage('items (item id) is required').toInt()],
  validate,
  createInquiryLog
);

// DELETE /api/inquiry-logs/:id - Remove log entry
router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  deleteInquiryLog
);

export default router;
