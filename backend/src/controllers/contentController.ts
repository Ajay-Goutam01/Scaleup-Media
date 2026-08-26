import { Request, Response } from 'express';
import { store } from '../services/store';

export const getContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const content = await store.getWebsiteContent();
    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve website content.',
      error: error.message,
    });
  }
};

export const updateContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await store.updateWebsiteContent(req.body);
    res.status(200).json({
      success: true,
      message: 'Website content updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update website content.',
      error: error.message,
    });
  }
};
