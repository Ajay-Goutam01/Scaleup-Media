import { Router } from 'express';
import { getContact, updateContact } from '../controllers/contactController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getContact);
router.put('/', authenticateAdmin, updateContact);

export default router;
