function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Image must be 5 MB or smaller.' });
  }

  if (error.message === 'Only JPEG, PNG, WEBP, and GIF images are allowed.') {
    return res.status(400).json({ message: error.message });
  }

  console.error(error);
  res.status(500).json({ message: 'Internal server error.' });
}

module.exports = { notFound, errorHandler };
