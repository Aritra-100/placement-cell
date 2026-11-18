import { asyncHandler } from '../../utils/asyncHandler';
import { env } from '../../config/env';
import * as authService from './auth.service';

const COOKIE_NAME = 'refreshToken';

function setReferenceCookie(res, token, expiresAt) {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: env.isProd,
        samSite: 'lax',
        path: '/api/v1/auth',
        expires: expiresAt,
    });
}