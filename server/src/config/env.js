import 'dotenv/config';

const e = process.env;

const errors = [];

function required(name, minLength = 1) {
    const value = e[name];
    if (!value || value.length < minLength) {
        errors.push(
            minLength > 1 ? `${name} is required and must have minimum ${minLength} characters` : `${name} is required`
        );
    }
    return value;
}

function toNumber(name, fallback) {
    const raw = e[name];
    if (raw === undefined || raw === '') return fallback;
    const num = Number(raw);
    if (Number.isNaN(num)) {
        errors.push(`${name} must be a number (got "${raw}")`);
        return fallback;
    }
    return num;
}

function oneOf(name, allowed, fallback) {
    const value = e[name] || fallback;
    if (!allowed.includes(value)) {
        errors.push(`${name} must be one of: ${allowed.join(', ')} (got "${value}")`);
    }
    return value;
}

const NODE_ENV = oneOf('NODE_ENV', ['development', 'test', 'production'], 'development');

const config = {
    NODE_ENV,
    PORT: toNumber('PORT', 5000),

    MONGO_URI: required('MONGO_URI'),
    REDIS_URL: e.REDIS_URL || 'redis://localhost:6379',

    JWT_ACCESS_SECRET: required('JWT_ACCESS_SECRET', 16),
    JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET', 16),
    JWT_ACCESS_EXPIRES: e.JWT_ACCESS_EXPIRES || '15m',
    JWT_REFRESH_EXPIRES: e.JWT_REFRESH_EXPIRES || '30m',

    BCRYPT_COST: toNumber('BCRYPT_COST', 12),

    CLIENT_URL: e.CLIENT_URL || 'http://localhost:5173',

    SMTP_HOST: e.SMTP_HOST,
    SMTP_PORT: e.SMTP_PORT ? toNumber('SMTP_PORT') : undefined,
    SMTP_USER: e.SMTP_USER,
    SMTP_PASS: e.SMTP_PASS,
    VAPID_PUBLIC_KEY: e.VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY: e.VAPID_PRIVATE_KEY,
};

if (errors.length > 0) {
    console.error('Invalid environment variables:');
    for (const message of errors) console.error(`     - ${message}`);
    process.exit(1);
}

export const env = {
  ...config,
  isProd: NODE_ENV === 'production',
  isTest: NODE_ENV === 'test',
};