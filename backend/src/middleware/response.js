// ─── Response helpers ────────────────────────────────────────────────────────

export const ok = (res, data, meta = {}) =>
  res.status(200).json({ success: true, data, ...meta });

export const created = (res, data) =>
  res.status(201).json({ success: true, data });

export const noContent = (res) =>
  res.status(204).send();

export const badRequest = (res, message = 'Bad request', errors = []) =>
  res.status(400).json({ success: false, message, errors });

export const notFound = (res, resource = 'Resource') =>
  res.status(404).json({ success: false, message: `${resource} not found` });

export const serverError = (res, message = 'Internal server error') =>
  res.status(500).json({ success: false, message });

// ─── Global error handler (register last in Express) ─────────────────────────

export function errorHandler(err, _req, res, _next) {
  console.error('Unhandled error:', err);
  return serverError(res, err.message || 'Unexpected error');
}

// ─── 404 catch-all ───────────────────────────────────────────────────────────

export function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
}
