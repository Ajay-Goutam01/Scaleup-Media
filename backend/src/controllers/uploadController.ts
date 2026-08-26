import { Request, Response } from 'express';
import { uploadToImageKit, isImageKitConfigured } from '../config/imagekit';
import fs from 'fs';
import path from 'path';

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded.',
      });
      return;
    }

    // Upload through ImageKit
    try {
      const fileName = `upload_${Date.now()}_${req.file.originalname}`;
      const result = await uploadToImageKit(req.file.path, 'scaleup-media/general', fileName);

      // Clean up local temporary file if present
      if (req.file.path && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch {}
      }

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully.',
        url: result.url,
        fileId: result.fileId,
        name: result.name,
      });
      return;
    } catch (kitErr: any) {
      console.warn('[Upload] ImageKit upload notice, using local file serving fallback:', kitErr.message);
    }

    // Fallback to local server URL
    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const localUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully.',
      url: localUrl,
      filename: req.file.filename,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'File upload failed.',
      error: error.message,
    });
  }
};

export const uploadMultipleFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No files uploaded.',
      });
      return;
    }

    const uploadPromises = files.map(async (file) => {
      try {
        const fileName = `upload_${Date.now()}_${file.originalname}`;
        const result = await uploadToImageKit(file.path, 'scaleup-media/general', fileName);
        if (file.path && fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
          } catch {}
        }
        return result.url;
      } catch {
        const host = req.get('host') || 'localhost:5000';
        const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
        return `${protocol}://${host}/uploads/${file.filename}`;
      }
    });

    const urls = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: `${files.length} files uploaded successfully.`,
      urls,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Multiple files upload failed.',
      error: error.message,
    });
  }
};
