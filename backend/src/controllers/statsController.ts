import { Request, Response } from 'express';
import { store } from '../services/store';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await store.getStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard statistics.',
      error: error.message,
    });
  }
};
