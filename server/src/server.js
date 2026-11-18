import { env } from "./config/env";
import { logger } from "./config/logger";
import { connectDB, disconnectDB } from './config/db';
import { app } from "./app";

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