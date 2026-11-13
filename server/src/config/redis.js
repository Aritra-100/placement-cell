import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

let client;

export function getRedis() {
    if (!client) {
        client = new Redis(env.REDIS_URL, {
            maxRetriesPerRequest: null,
            lazyConnect: true,
        });
        client.on('connect', () => logger.info('Redis connected'));
        client.on('error', (err) => logger.error({ err }, 'Redis error'));
    }
    return client;
}

export async function connectRedis() {
    const redis = getRedis();
    if (redis.status === 'wait') await redis.connect();
    return redis;
}

export async function disconnectRedis() {
    if (client) {
        await client.quit();
        client = undefined;
    }    
}