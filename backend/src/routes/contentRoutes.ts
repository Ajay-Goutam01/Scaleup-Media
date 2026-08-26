import { Router } from 'express';
import { getContent, updateContent } from '../controllers/contentController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getContent);
router.put('/', authenticateAdmin, updateContent);

export default router;
