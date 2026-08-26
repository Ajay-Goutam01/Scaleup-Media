import { Router } from 'express';
import { authenticateAdmin } from '../middleware/auth';
import { getTheme, updateTheme } from '../controllers/themeController';

const router = Router();

router.get('/', getTheme);
router.put('/', authenticateAdmin, updateTheme);

export default router;
