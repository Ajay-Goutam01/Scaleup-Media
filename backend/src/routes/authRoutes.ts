import { Router } from 'express';
import { login, getMe, logout, changePassword, changeEmail } from '../controllers/authController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.get('/me', authenticateAdmin, getMe);
router.post('/logout', logout);
router.post('/change-password', authenticateAdmin, changePassword);
router.put('/change-email', authenticateAdmin, changeEmail);

export default router;
