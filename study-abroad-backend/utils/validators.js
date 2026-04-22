const { body, validationResult } = require('express-validator');
const { errorResponse } = require('./apiResponse');

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation failed', errors.array());
  }
  return next();
}

const registerValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
  validateRequest,
];

const loginValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validateRequest,
];

const preferencesValidators = [
  body('budget').optional().isNumeric(),
  body('ieltsScore').optional().isFloat({ min: 0, max: 9 }),
  validateRequest,
];

const applicationValidators = [
  body('programId').notEmpty().isMongoId().withMessage('Valid programId required'),
  validateRequest,
];

const statusUpdateValidators = [
  body('status').notEmpty().isIn(['Reviewed', 'Accepted', 'Rejected', 'Withdrawn']),
  body('note').optional().isString(),
  validateRequest,
];

module.exports = {
  validateRequest,
  registerValidators,
  loginValidators,
  preferencesValidators,
  applicationValidators,
  statusUpdateValidators,
};
