import { validationResult } from 'express-validator';
import { badRequest } from './response.js';

/**
 * Run after express-validator chains.
 * Returns 400 with all validation errors if any.
 */
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return badRequest(res, 'Validation failed', errors.array());
  }
  next();
}
