import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { store } from '../services/store';

export interface AuthRequest extends Request {
  admin?: any;
}

export const authenticateAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = String(req.query.token);
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. No authorization token provided.',
      });
      return;
    }

    const secret = process.env.JWT_SECRET || 'scaleup_media_super_secret_jwt_key_2026_growth_strategy_impact';
    const decoded: any = jwt.verify(token, secret);

    const admin = await store.findAdminById(decoded.id);
    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Invalid session or user no longer exists.',
      });
      return;
    }

    req.admin = admin;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized token invalid or expired.',
    });
  }
};
