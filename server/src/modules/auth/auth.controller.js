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

export const register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.valid.body);
    res.status(201).json({ data: { user } });
});

export const login = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken, refreshExpiresAt } = await authService.login(req.valid.body);
    setRefreshCookie(res, refreshToken, refreshExpiresAt);
    res.json({ data: { user, accessToken } });
}); 