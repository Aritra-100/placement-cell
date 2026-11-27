import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

mongoose.set('strictQuery', true);

export async function connectDB(uri = env.MONGO_URI) {
    mongoose.connection.on('connected', () => logger.info('MongoDB connected'));
    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
    mongoose.connection.on('error', (err) => logger.error({ err }, 'MongoDB error'));

    await mongoose.connect(uri, {
        autoIndex: !env.isProd,
        maxPoolSize: 20,
        serverSelectionTimeoutMS: 5000,
    });

    return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}