import { Request, Response } from 'express';
import { store } from '../services/store';
import { uploadToImageKit, deleteFromImageKit } from '../config/imagekit';
import path from 'path';
import fs from 'fs';

export const getContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await store.getContactSettings();
    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contact settings.',
      error: error.message,
    });
  }
};

export const updateContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await store.updateContactSettings(req.body);
    res.status(200).json({
      success: true,
      message: 'Contact & WhatsApp settings updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update contact settings.',
      error: error.message,
    });
  }
};

/**
 * POST /api/contact/founder-photo — Admin: upload founder photo via ImageKit
 */
export const uploadFounderPhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No photo file provided.' });
      return;
    }

    // Delete old founder photo from ImageKit if exists
    const current = await store.getContactSettings();
    if ((current as any)?.founderPhotoFileId && !(current as any).founderPhotoFileId.startsWith('local_')) {
      await deleteFromImageKit((current as any).founderPhotoFileId).catch(() => {});
    }

    const result = await uploadToImageKit(
      req.file.path,
      'scaleup-media/founder',
      `founder_${Date.now()}${path.extname(req.file.originalname)}`
    );

    // Clean up local temp file
    try { fs.unlinkSync(req.file.path); } catch {}

    const updated = await store.updateContactSettings({
      founderPhotoUrl: result.url,
      founderPhotoFileId: result.fileId,
    });

    res.status(200).json({ success: true, message: 'Founder photo uploaded successfully.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to upload founder photo.', error: error.message });
  }
};

/**
 * DELETE /api/contact/founder-photo — Admin: remove founder photo
 */
export const removeFounderPhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const current = await store.getContactSettings();
    if ((current as any)?.founderPhotoFileId && !(current as any).founderPhotoFileId.startsWith('local_')) {
      await deleteFromImageKit((current as any).founderPhotoFileId).catch(() => {});
    }
    const updated = await store.updateContactSettings({
      founderPhotoUrl: '',
      founderPhotoFileId: '',
    });
    res.status(200).json({ success: true, message: 'Founder photo removed.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to remove founder photo.', error: error.message });
  }
};
