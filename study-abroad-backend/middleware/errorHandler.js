function errorHandler(err, _req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if (err.code === 11000) {
    statusCode = 409;
    const keyValue = err.keyValue || {};
    // Provide human-readable messages for known duplicate key patterns
    if (keyValue.email) message = 'Email already registered';
    else if (keyValue.user !== undefined && keyValue.program !== undefined) message = 'You have already applied to this program';
    else {
      const field = Object.keys(keyValue)[0] || 'Record';
      message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
