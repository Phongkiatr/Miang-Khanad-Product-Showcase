/**
 * Authentication Middleware
 * Validates the administrative token in the Authorization header.
 */

export function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = process.env.ADMIN_TOKEN || 'mk_secret_token_2025';

  if (!authHeader || authHeader !== `Bearer ${token}`) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Admin access required'
    });
  }

  next();
}
