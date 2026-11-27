import { asyncHandler } from '../../utils/asyncHandler.js';
import { env } from '../../config/env.js';
import * as authService from './auth.service.js';

const COOKIE_NAME = 'refreshToken';

function setRefreshCookie(res, token, expiresAt) {
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

export const refresh = asyncHandler(async (req, res) => {
    const { accessToken, refreshToken, refreshExpiresAt } = await authService.refresh(req.cookies[COOKIE_NAME]);
    setRefreshCookie(res, refreshToken, refreshExpiresAt);
    res.json({ data: { accessToken } });
});

export const logout = asyncHandler(async (req, res) => {
    await authService.logout(req.cookies[COOKIE_NAME]);
    res.clearCookie(COOKIE_NAME, { path: '/api/v1/auth' });
    res.status(204).end();
});

export const me = asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.user.id);
    res.json({ data: { user } });
});