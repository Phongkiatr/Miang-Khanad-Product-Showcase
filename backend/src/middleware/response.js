/**
 * Standardized response helpers for consistent API communication
 */

// 200 OK - Successful retrieval or operation
export const ok = (res, data, meta = {}) =>
  res.status(200).json({ success: true, data, ...meta });

// 201 Created - Successfully created a resource
export const created = (res, data) =>
  res.status(201).json({ success: true, data });

// 204 No Content - Successful operation with no return data
export const noContent = (res) =>
  res.status(204).send();

// 400 Bad Request - Client-side error or validation failure
export const badRequest = (res, message = 'Bad request', errors = []) =>
  res.status(400).json({ success: false, message, errors });

// 404 Not Found - Resource does not exist
export const notFound = (res, resource = 'Resource') =>
  res.status(404).json({ success: false, message: `${resource} not found` });

// 500 Internal Server Error - Unexpected server-side failure
export const serverError = (res, message = 'Internal server error') =>
  res.status(500).json({ success: false, message });

// ─── Error Handlers ──────────────────────────────────────────────────────────

// Global catch-all for errors thrown during request processing
export function errorHandler(err, _req, res, _next) {
  console.error('Unhandled error:', err);
  return serverError(res, err.message || 'Unexpected error');
}

// Handler for undefined routes
export function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
}
