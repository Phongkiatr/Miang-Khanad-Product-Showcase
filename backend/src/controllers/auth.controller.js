import { ok, badRequest } from '../middleware/response.js';

/**
 * Authentication Controller
 * Handles administrative login and token issuance.
 */

/**
 * POST /api/auth/login
 * Validates password and returns the administrative token.
 */
export async function login(req, res) {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    const adminToken = process.env.ADMIN_TOKEN || 'mk_secret_token_2025';

    if (password === adminPassword) {
      return ok(res, { token: adminToken });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid password'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
