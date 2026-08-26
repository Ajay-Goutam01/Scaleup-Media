import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.get('/', authenticateAdmin, getDashboardStats);

export default router;
