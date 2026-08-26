import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { authenticateAdmin } from '../middleware/auth';
import {
  submitReview,
  getPublicReviews,
  getAdminReviews,
  approveReview,
  rejectReview,
  unpublishReview,
  deleteReview,
} from '../controllers/reviewController';

const router = Router();

// Stricter rate limit for public review submissions
const reviewSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 review submissions per IP per window
  message: { success: false, message: 'Too many review submissions, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Multer config for optional profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve(__dirname, '../../uploads/reviews');
    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `review_${Date.now()}${ext}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// --- Public Routes ---
router.post('/', reviewSubmitLimiter, upload.single('profileImage'), submitReview);
router.get('/public', getPublicReviews);

// --- Admin Routes ---
router.get('/admin', authenticateAdmin, getAdminReviews);
router.put('/admin/:id/approve', authenticateAdmin, approveReview);
router.put('/admin/:id/reject', authenticateAdmin, rejectReview);
router.put('/admin/:id/unpublish', authenticateAdmin, unpublishReview);
router.delete('/admin/:id', authenticateAdmin, deleteReview);

export default router;
