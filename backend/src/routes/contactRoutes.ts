import { Router } from 'express';
import {
  getContact,
  updateContact,
  uploadFounderPhoto,
  removeFounderPhoto,
} from '../controllers/contactController';
import { authenticateAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getContact);
router.put('/', authenticateAdmin, updateContact);
router.post('/founder-photo', authenticateAdmin, upload.single('photo'), uploadFounderPhoto);
router.delete('/founder-photo', authenticateAdmin, removeFounderPhoto);

export default router;
