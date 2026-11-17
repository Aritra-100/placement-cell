import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { env } from '../../config/env';
import { ApiError } from '../../utils/APIError';
import { User } from './auth.model';
import { RefreshToken } from './refreshToken.model';

const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', env.BCRYPT_COST);

const INVALID_LOGIN = 'Invalid Email/Password: Try Again';

function parseDuration(text) {
    const match = /^(\d+)([smhd])$/.exec(text);
    if (!match) throw new Error(`Invalid Duration: ${text}`);
    const units = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
    return Number(match[1]) * units[match[2]];
}

const hashToken = (token) => {
    crypto.createHmac('sha256', env.JWT_REFRESH_SECRET).update(token).digest('hex');
    async function getCompanyId(user) {
        return undefined;
    }
}

async function issueToken(user) {
    const companyId = user.role === 'recruiter' ? await getCompanyId(user) : undefined;

    const accessToken = jwt.sign({ role: user.role, companyId }, env.JWT_ACCESS_SECRET, {
        subject: String(user._id),
        expiresIn: env.JWT_ACCESS_EXPIRES,
    });

    const refreshToken = crypto.randomBytes(48).toString('hex');
    const refreshExpiresAt = new Date(Date.now() + parseDuration(env.JWT_ACCESS_EXPIRES));

    await RefreshToken.create({
        userId: user._id,
        tokenHash: hashToken(refreshToken),
        expiresAt: refreshExpiresAt,
    });

    return { accessToken, refreshToken, refreshExpiresAt };
}

export async function register({ name, email, password, role }) {
    const existing = await User.exists({ email });
    if (existing) throw ApiError.conflict('An account with this email already exists');

    const passwordHash = await bcrypt.hash(password, env.BCRYPT_COST);
    const user = await User.create({ name, email, passwordHash, role });
    return user;
}