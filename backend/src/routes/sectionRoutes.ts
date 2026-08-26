import { Router } from 'express';
import { getSections, updateSections } from '../controllers/sectionController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getSections);
router.put('/', authenticateAdmin, updateSections);

export default router;
