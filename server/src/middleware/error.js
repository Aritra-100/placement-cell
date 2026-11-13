import { ApiError } from "../utils/APIError";
import { logger } from "../config/logger";
import { env } from "../config/env";

export function notFound(req, res, next) {
    next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

function normalize(err) {
    if (err instanceof ApiError) return err;

    if (err.type === 'entity.parse.failed') {
        return ApiError.badRequest('Request body is not valid JSON');
    }
    if (err.type === 'entity.too.large') {
        return new ApiError(413, 'Request is too large', { code: 'PAYLOAD_TOO_LARGE' });
    }

    if (err.name === 'ValidationError' && err.errors) {
        const details = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
        return ApiError.validation('Validation failed', { details });
    }

    if (err.name === 'CastError') {
        return ApiError.badRequest(`Invalid value for ${err.path}`);
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {}).join(', ') || 'field';
        return ApiError.conflict(`Duplicate value for ${field}`);
    }

    return null;
}

export function errorHandler(err, req, res, next) {
    const known = normalize(err);

    if (known) {
        if (known.statusCode >= 500) logger.error({ err }, 'Server error');
        return res.status(known.statusCode).json({
            error: {
                code: known.code,
                message: known.message,
                details: known.details ?? null,
            },
        });
    }
    
    logger.error({ err, path: req.originalUrl, method: req.method, userId: req.user?.id }, 'Unhandled error');
    res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: env.isProd ? 'Something went wrong' : err.message,
      details: null,
    },
  });
}