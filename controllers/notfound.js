const notFound = (req, res, next) => {
  const timestamp = new Date().toISOString(); // ISO timestamp (e.g., 2025-07-15T10:00:00.000Z)

  console.warn(`[${timestamp}] Route not found: ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    code: 404,
    status: false,
    message: `API route '${req.originalUrl}' is not available`,
    method: req.method,
    path: req.originalUrl,
    timestamp: timestamp
  });
};

module.exports = notFound;
