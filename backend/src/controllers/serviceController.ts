import { Request, Response } from 'express';
import { store } from '../services/store';

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const isPublic = req.query.activeOnly === 'true' || req.query.public === 'true';
    const services = await store.getServices({
      activeOnly: isPublic ? true : undefined,
    });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve services.',
      error: error.message,
    });
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { serviceNumber, title, tagline, description, tags, icon, active, order } = req.body;

    if (!serviceNumber || !title || !tagline || !description) {
      res.status(400).json({
        success: false,
        message: 'Please provide serviceNumber, title, tagline, and description.',
      });
      return;
    }

    const created = await store.createService({
      serviceNumber,
      title,
      tagline,
      description,
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((s) => s.trim()) : [],
      icon: icon || 'Sparkles',
      active: active !== undefined ? Boolean(active) : true,
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: created,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create service.',
      error: error.message,
    });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const body = { ...req.body };
    if (typeof body.tags === 'string') {
      body.tags = body.tags.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    const updated = await store.updateService(id, body);
    if (!updated) {
      res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update service.',
      error: error.message,
    });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const deleted = await store.deleteService(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Service not found or already removed.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete service.',
      error: error.message,
    });
  }
};
