function successResponse(res, statusCode, message, data, pagination) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(pagination && { pagination }),
  });
}

function errorResponse(res, statusCode, message, errors = []) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length && { errors }),
  });
}

module.exports = { successResponse, errorResponse };
