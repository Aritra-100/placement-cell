import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes.js';

const router = Router();

router.use('/auth', authRoutes);
// For later we hav to do this:
// router.use('/students', ...), router.use('/jobs', ...), etc...

export default router;