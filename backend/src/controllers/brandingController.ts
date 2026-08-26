import { Request, Response } from 'express';
import { store } from '../services/store';
import { uploadToImageKit, deleteFromImageKit } from '../config/imagekit';
import fs from 'fs';

/**
 * GET /api/branding — Public
 */
export const getBranding = async (req: Request, res: Response): Promise<void> => {
  try {
    const branding = await store.getBranding();
    res.status(200).json({ success: true, data: branding });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch branding.', error: error.message });
  }
};

/**
 * PUT /api/branding — Admin: update brand name and tagline
 */
export const updateBranding = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brandName, tagline } = req.body;
    const updates: any = {};
    if (brandName !== undefined) updates.brandName = String(brandName).trim();
    if (tagline !== undefined) updates.tagline = String(tagline).trim();

    const updated = await store.updateBranding(updates);
    res.status(200).json({ success: true, message: 'Branding updated.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update branding.', error: error.message });
  }
};

/**
 * POST /api/branding/logo — Admin: upload logo via ImageKit
 */
export const uploadLogo = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No logo file provided.' });
      return;
    }

    // Delete old logo from ImageKit if exists
    const current = await store.getBranding();
    if ((current as any)?.logoFileId && !(current as any).logoFileId.startsWith('local_')) {
      await deleteFromImageKit((current as any).logoFileId).catch(() => {});
    }

    const result = await uploadToImageKit(
      req.file.path,
      'scaleup-media/branding',
      `logo_${Date.now()}${require('path').extname(req.file.originalname)}`
    );

    // Clean up local temp file
    try { fs.unlinkSync(req.file.path); } catch {}

    const updated = await store.updateBranding({
      logoUrl: result.url,
      logoFileId: result.fileId,
    });

    res.status(200).json({ success: true, message: 'Logo uploaded.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to upload logo.', error: error.message });
  }
};

/**
 * DELETE /api/branding/logo — Admin: remove logo
 */
export const removeLogo = async (req: Request, res: Response): Promise<void> => {
  try {
    const current = await store.getBranding();
    if ((current as any)?.logoFileId) {
      await deleteFromImageKit((current as any).logoFileId).catch(() => {});
    }
    const updated = await store.updateBranding({ logoUrl: '', logoFileId: '' });
    res.status(200).json({ success: true, message: 'Logo removed.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to remove logo.', error: error.message });
  }
};

/**
 * POST /api/branding/favicon — Admin: upload favicon
 */
export const uploadFavicon = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No favicon file provided.' });
      return;
    }

    const current = await store.getBranding();
    if ((current as any)?.faviconFileId && !(current as any).faviconFileId.startsWith('local_')) {
      await deleteFromImageKit((current as any).faviconFileId).catch(() => {});
    }

    const result = await uploadToImageKit(
      req.file.path,
      'scaleup-media/branding',
      `favicon_${Date.now()}${require('path').extname(req.file.originalname)}`
    );

    try { fs.unlinkSync(req.file.path); } catch {}

    const updated = await store.updateBranding({
      faviconUrl: result.url,
      faviconFileId: result.fileId,
    });

    res.status(200).json({ success: true, message: 'Favicon uploaded.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to upload favicon.', error: error.message });
  }
};

/**
 * DELETE /api/branding/favicon — Admin: remove favicon
 */
export const removeFavicon = async (req: Request, res: Response): Promise<void> => {
  try {
    const current = await store.getBranding();
    if ((current as any)?.faviconFileId) {
      await deleteFromImageKit((current as any).faviconFileId).catch(() => {});
    }
    const updated = await store.updateBranding({ faviconUrl: '', faviconFileId: '' });
    res.status(200).json({ success: true, message: 'Favicon removed.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to remove favicon.', error: error.message });
  }
};
