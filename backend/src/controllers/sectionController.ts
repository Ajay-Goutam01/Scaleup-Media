import { Request, Response } from 'express';
import { store } from '../services/store';

export const getSections = async (req: Request, res: Response): Promise<void> => {
  try {
    const sections = await store.getSectionSettings();
    res.status(200).json({
      success: true,
      data: sections,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve section settings.',
      error: error.message,
    });
  }
};

export const updateSections = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await store.updateSectionSettings(req.body);
    res.status(200).json({
      success: true,
      message: 'Section visibility settings updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update section settings.',
      error: error.message,
    });
  }
};
