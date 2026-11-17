export const registerSchema = {
  name: { type: 'string', required: true, minLength: 2, maxLength: 50 },
  email: { type: 'email', required: true, maxLength: 100 },
  password: {
    type: 'string',
    required: true,
    minLength: 8,
    maxLength: 72, // bcrypt ignores anything past 72 bytes
    pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/,
    patternMessage: 'password must contain at least one letter and one number',
  },
  role: { type: 'string', required: true, enum: ['student', 'recruiter'] },
};

export const loginSchema = {
  email: { type: 'email', required: true },
  password: { type: 'string', required: true, maxLength: 72 },
};