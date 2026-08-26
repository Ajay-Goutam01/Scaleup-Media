import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';

const getUploadDir = (): string => {
  const isServerless = process.env.VERCEL || process.env.NODE_ENV === 'production';
  const targetDir = isServerless
    ? path.join(os.tmpdir(), 'scaleup-uploads')
    : path.resolve(__dirname, '../../uploads');

  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    return targetDir;
  } catch (err) {
    return os.tmpdir();
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getUploadDir());
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `scaleup-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'video/mp4'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WEBP, SVG, GIF and MP4 files are supported'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB
  },
  fileFilter,
});
