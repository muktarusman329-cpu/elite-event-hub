import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, param, query, validationResult } from 'express-validator';

// Security middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// Rate limiting
export const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV === 'development',
  });
};

// Specific rate limiters
export const authLimiter = createRateLimiter(15 * 60 * 1000, 5);
export const generalLimiter = createRateLimiter(15 * 60 * 1000, 100);
export const apiLimiter = createRateLimiter(1 * 60 * 1000, 60);

// Validation middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validators
export const validateEmail = () =>
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address');

export const validatePassword = () =>
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and numbers');

export const validateRequired = (field) =>
  body(field).trim().notEmpty().withMessage(`${field} is required`);

export const validateString = (field, maxLength = 500) =>
  body(field)
    .isString()
    .trim()
    .isLength({ max: maxLength })
    .withMessage(`${field} must be less than ${maxLength} characters`);

export const validateNumber = (field) =>
  body(field)
    .isNumeric()
    .withMessage(`${field} must be a number`);

export const validateDate = (field) =>
  body(field)
    .isISO8601()
    .withMessage(`${field} must be a valid date`);

export const validateId = () =>
  param('id').isInt().withMessage('ID must be a valid integer');

export const validateLimit = () =>
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100');

export const validateOffset = () =>
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a positive number');

// Combined validators for common operations
export const validateSignup = () => [
  validateRequired('name'),
  validateEmail(),
  validatePassword(),
  handleValidationErrors,
];

export const validateLogin = () => [
  validateEmail(),
  validateRequired('password'),
  handleValidationErrors,
];

export const validateBooking = () => [
  validateRequired('name'),
  validateEmail(),
  validateRequired('phone'),
  validateRequired('eventType'),
  validateDate('date'),
  validateString('notes', 1000),
  validateNumber('guests'),
  handleValidationErrors,
];

export const validateHall = () => [
  validateRequired('name'),
  validateString('description', 2000),
  validateNumber('capacity'),
  validateNumber('price'),
  validateRequired('location'),
  handleValidationErrors,
];

export const validateService = () => [
  validateRequired('name'),
  validateString('description', 1000),
  validateNumber('price'),
  handleValidationErrors,
];
