import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/APIError';

export function authenticate(req, res, next) {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return next(ApiError.unauthorized('Missing or malformed Authorization header'));
    }

    
}