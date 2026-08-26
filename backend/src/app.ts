import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import os from 'os';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import { errorHandler } from './middleware/errorHandler';
import { connectDB, getDbStatus } from './config/db';

import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import serviceRoutes from './routes/serviceRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import contentRoutes from './routes/contentRoutes';
import sectionRoutes from './routes/sectionRoutes';
import contactRoutes from './routes/contactRoutes';
import uploadRoutes from './routes/uploadRoutes';
import statsRoutes from './routes/statsRoutes';
import reviewRoutes from './routes/reviewRoutes';
import brandingRoutes from './routes/brandingRoutes';
import themeRoutes from './routes/themeRoutes';

export const app = express();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Trust proxy for rate limiting behind Vercel edge proxies / load balancers
app.set('trust proxy', 1);

// Security Headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Dynamic CORS configuration supporting development, configured CLIENT_URL, and Vercel preview domains
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        CLIENT_URL,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ];

      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production';

      if (isAllowed) {
        callback(null, true);
      } else {
        // Reject without throwing unhandled Error
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // max 1000 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60, // max 60 login attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many login attempts, please try again in 15 minutes.',
  },
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);

// Body Parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory (for local dev fallback)
const isServerless = process.env.VERCEL || process.env.NODE_ENV === 'production';
const UPLOADS_DIR = isServerless
  ? path.join(os.tmpdir(), 'scaleup-uploads')
  : path.resolve(__dirname, '../uploads');
try {
  app.use('/uploads', express.static(UPLOADS_DIR));
} catch {}

// Health check endpoint (always available, does not block on DB)
const handleHealth = (req: express.Request, res: express.Response) => {
  const dbStatus = getDbStatus();
  res.status(200).json({
    success: true,
    message: 'ScaleUp Media API is running',
    data: {
      api: 'ok',
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
};

app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

// Lazy database connection for all non-health API endpoints
app.use('/api', async (req, res, next) => {
  if (req.path === '/health') {
    return next();
  }
  try {
    await connectDB();
  } catch (err: any) {
    console.warn('[Database] Async connection notice:', err.message);
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/branding', brandingRoutes);
app.use('/api/theme', themeRoutes);

// Root greeting endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ScaleUp Media REST API Server',
    status: 'active',
    documentation: '/api/health',
  });
});

// Catch-all 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found.`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
