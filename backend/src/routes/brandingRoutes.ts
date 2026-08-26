import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateAdmin } from '../middleware/auth';
import {
  getBranding,
  updateBranding,
  uploadLogo,
  removeLogo,
  uploadFavicon,
  removeFavicon,
} from '../controllers/brandingController';

const router = Router();

// Multer for branding images (logo, favicon)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isServerless = process.env.VERCEL || process.env.NODE_ENV === 'production';
    const uploadDir = isServerless
      ? path.join(require('os').tmpdir(), 'scaleup-branding')
      : path.resolve(__dirname, '../../uploads/branding');
    try {
      const fs = require('fs');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      cb(null, require('os').tmpdir());
    }
  },
  filename: (req, file, cb) => {
    cb(null, `branding_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = /jpeg|jpg|png|webp|gif|svg|ico/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ext) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, png, svg, webp, ico)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.get('/', getBranding);
router.put('/', authenticateAdmin, updateBranding);
router.post('/logo', authenticateAdmin, upload.single('logo'), uploadLogo);
router.delete('/logo', authenticateAdmin, removeLogo);
router.post('/favicon', authenticateAdmin, upload.single('favicon'), uploadFavicon);
router.delete('/favicon', authenticateAdmin, removeFavicon);

export default router;
