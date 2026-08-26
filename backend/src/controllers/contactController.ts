import { Request, Response } from 'express';
import { store } from '../services/store';

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
