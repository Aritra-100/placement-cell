import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        tokenHash: { type: String, required: true, unique: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamp: true }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expiresAfterSeconds: 0 });

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);