import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { store } from '../services/store';
import { AuthRequest } from '../middleware/auth';

const generateToken = (id: string, email: string, role: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn('[Auth] WARNING: JWT_SECRET environment variable is not set. Using insecure fallback. Set JWT_SECRET in production!');
  }
  const effectiveSecret = secret || 'scaleup_media_super_secret_jwt_key_2026_growth_strategy_impact';
  return jwt.sign({ id, email, role }, effectiveSecret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
      return;
    }

    const admin = await store.findAdminByEmail(email);
    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
      return;
    }

    // Compare bcrypt password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
      return;
    }

    const token = generateToken(admin._id || admin.id, admin.email, admin.role || 'superadmin');

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      mustChangePassword: admin.mustChangePassword || false,
      admin: {
        id: admin._id || admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        mustChangePassword: admin.mustChangePassword || false,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error during login process.',
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    res.status(200).json({
      success: true,
      admin: {
        id: req.admin._id || req.admin.id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
        mustChangePassword: req.admin.mustChangePassword || false,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user profile.',
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

/**
 * POST /api/auth/change-password — Admin: change own password (requires current password)
 */
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'Please provide currentPassword, newPassword, and confirmPassword.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match.',
      });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.',
      });
      return;
    }

    // Fetch admin WITH password for comparison
    const adminWithPassword = await store.findAdminByEmail(req.admin.email);
    if (!adminWithPassword) {
      res.status(404).json({ success: false, message: 'Admin not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, adminWithPassword.password);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect.',
      });
      return;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update in store (bypasses pre-save hook — already hashed)
    await store.updateAdminPassword(adminWithPassword._id || adminWithPassword.id, hashedPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please log in again with your new password.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to change password.',
    });
  }
};

/**
 * PUT /api/auth/change-email — Admin: change own email
 */
export const changeEmail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { newEmail, currentPassword } = req.body;

    if (!newEmail || !currentPassword) {
      res.status(400).json({
        success: false,
        message: 'Please provide newEmail and currentPassword.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    const adminWithPassword = await store.findAdminByEmail(req.admin.email);
    if (!adminWithPassword) {
      res.status(404).json({ success: false, message: 'Admin not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, adminWithPassword.password);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      return;
    }

    await store.updateAdminEmail(adminWithPassword._id || adminWithPassword.id, newEmail.toLowerCase().trim());

    res.status(200).json({
      success: true,
      message: 'Email updated successfully. Please log in again with your new email.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update email.',
    });
  }
};
