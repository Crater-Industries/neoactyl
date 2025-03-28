export class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }

  static badRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized access') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden access') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message);
  }
}

export const handleApiError = (error, dev = process.env.NODE_ENV === 'development') => {
  if (error instanceof ApiError) {
    return Response.json({
      success: false,
      message: error.message,
      ...(error.errors.length > 0 && { errors: error.errors }),
      ...(dev && { stack: error.stack }),
    }, { status: error.statusCode });
  }

  // Sequelize validation errors
  if (error.name === 'SequelizeValidationError') {
    return Response.json({
      success: false,
      message: 'Validation error',
      errors: error.errors.map(err => ({
        field: err.path,
        message: err.message
      })),
      ...(dev && { stack: error.stack }),
    }, { status: 400 });
  }

  // Generic error response
  console.error('Unhandled error:', error);
  return Response.json({
    success: false,
    message: dev ? error.message : 'An unexpected error occurred',
    ...(dev && { stack: error.stack }),
  }, { status: 500 });
};