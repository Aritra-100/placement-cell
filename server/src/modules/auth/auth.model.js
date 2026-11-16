import mongoose from "mongoose";

export const ROLES = ['student', 'recruiter', 'coordinator', 'dev'];

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxLength: 50 },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true, select: false },
        role: { type: String, enum: ROLES, required: true },
        status: { type: String, enum: ['active', 'disabled'], default: 'active' },
        lastLoginAt: Date,
    },
    { timestamps: true }
);

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
    },
});

export const User = mongoose.model('User', userSchema);