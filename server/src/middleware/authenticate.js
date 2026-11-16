import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/APIError';

export function authenticate(req, res, next) {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return next(ApiError.unauthorized('Missing or malformed Authorization header'));
    }

    try {
        const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
        req.user = {
            id: payload.sub,
            role: payload.role,
            companyId: payload.companyId,
        };
        next();
    }
    catch (err) {
        if (err.name = 'TokenExpiredError') {
            return next(ApiError.unauthorized('Access token expired', { code: 'TOKEN_EXPIRED' }));
        }
        next(ApiError.unauthorized('Invalid access token', { code: 'INVALID_TOKEN' }));
    }
}