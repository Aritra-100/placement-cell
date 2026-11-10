import pino from 'pino';
import { env } from './env.js';

export const logger = pino({
    level: env.isTest ? 'silent' : env.isProd ? 'info' : 'debug',
    redact: {
        paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'password',
            '*.password',
            'passwordHash',
            '*.passwordHash',
            'token',
            'refreshToken',
        ],
        censor: '[REDACTED]',
    },
    ...(env.NODE_ENV === 'development' && {
        transport: { target: 'pino-pretty', options: { colorize: true }},
    }),
})