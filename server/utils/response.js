/**
 * API Response Helper
 * Standardizes API responses across the application
 */

export class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

/**
 * API Error Helper
 * Standardizes error responses across the application
 */
export class ApiError extends Error {
  constructor(statusCode, message = 'Internal Server Error', errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async handler wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * Success response
 */
export const sendSuccess = (res, statusCode, data, message = 'Success') => {
  return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
};

/**
 * Error response
 */
export const sendError = (res, statusCode, message, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
  });
};

/**
 * Format pagination response
 */
export const paginatedResponse = (data, page, limit, total) => {
  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Common error handler
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return sendError(
      res,
      400,
      'Validation Error',
      err.errors.map(e => ({
        field: e.path,
        message: e.message,
      }))
    );
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return sendError(
      res,
      400,
      `${err.errors[0].path} already exists`,
      [{ field: err.errors[0].path, message: 'This field must be unique' }]
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token expired');
  }

  // Custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error',
  });
};

/**
 * 404 handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Resource not found',
    path: req.originalUrl,
  });
};
