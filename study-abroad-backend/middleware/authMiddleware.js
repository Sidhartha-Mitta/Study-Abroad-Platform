const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'No token provided');
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).lean();

    if (!user) {
      return errorResponse(res, 401, 'User no longer exists');
    }

    req.user = user;
    return next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Invalid token');
    }
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token has expired');
    }
    return next(err);
  }
}

async function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return next();
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).lean();
    if (user) {
      req.user = user;
    }
    return next();
  } catch (_err) {
    return next();
  }
}

function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Not authorized to perform this action');
    }
    next();
  };
}

module.exports = { protect, optionalAuth, restrictTo };
