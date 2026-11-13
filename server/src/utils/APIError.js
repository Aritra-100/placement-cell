export class ApiError extends Error {
  constructor(statusCode, message, { code, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code || ApiError.defaultCode(statusCode);
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static defaultCode(status) {
    const codes = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'TOO_MANY_REQUESTS',
    };
    return codes[status] || 'INTERNAL_ERROR';
  }

  static badRequest(message = 'Bad request', opts) { return new ApiError(400, message, opts); }
  static unauthorized(message = 'Authentication required', opts) { return new ApiError(401, message, opts); }
  static forbidden(message = 'You do not have permission', opts) { return new ApiError(403, message, opts); }
  static notFound(message = 'Resource not found', opts) { return new ApiError(404, message, opts); }
  static conflict(message = 'Resource already exists', opts) { return new ApiError(409, message, opts); }
  static validation(message = 'Validation failed', opts) { return new ApiError(422, message, opts); }
}