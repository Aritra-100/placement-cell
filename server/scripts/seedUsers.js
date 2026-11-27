import bcrypt from 'bcrypt';
import { env } from '../src/config/env.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/modules/auth/auth.model.js';

const password = process.env.SEED_PASSWORD || 'Change123';

const users = [
    { name: 'Placement Coordinator', email: 'coordinator@example.com', role: 'coordinator' },
    { name: 'Dev Admin', email: 'dev@example.com', role: 'dev' },
];

await connectDB();
for (const user of users) {
    const passwordHash = await bcrypt.hash(password, env.BCRYPT_COST);
    await User.updateOne({ email: user.email }, { $setOnInsert: { ...user, passwordHash } }, { upsert: true });
    console.log(`User is :
        ${user.email} (${user.role})`);
}

await disconnectDB();