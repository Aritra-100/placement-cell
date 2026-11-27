import { env } from './config/env.js';
import { logger } from "./config/logger.js";
import { connectDB, disconnectDB } from './config/db.js';
import { app } from "./app.js";

await connectDB();
const server = app.listen(env.PORT, () => logger.info(`API listening on port ${env.PORT}`));
async function shut(signal) {
    logger.info(`${signal} received, shutting down now!!`);
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
}
process.on('SIGINT', () => shut('SIGINT'));
process.on('SIGTERM', () => shut('SIGTERM'));