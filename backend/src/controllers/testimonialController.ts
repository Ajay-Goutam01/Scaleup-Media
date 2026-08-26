import { Request, Response } from 'express';
import { store } from '../services/store';

export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const isPublic = req.query.activeOnly === 'true' || req.query.public === 'true';
    const testimonials = await store.getTestimonials({
      activeOnly: isPublic ? true : undefined,
    });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve testimonials.',
      error: error.message,
    });
  }
};

export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientName, company, review, profileImage, rating, marqueeRow, active, order } = req.body;

    if (!clientName || !company || !review) {
      res.status(400).json({
        success: false,
        message: 'Please provide clientName, company, and review text.',
      });
      return;
    }

    const created = await store.createTestimonial({
      clientName,
      company,
      review,
      profileImage: profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      rating: Number(rating) || 5,
      marqueeRow: Number(marqueeRow) === 2 ? 2 : 1,
      active: active !== undefined ? Boolean(active) : true,
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully.',
      data: created,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create testimonial.',
      error: error.message,
    });
  }
};

export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const updated = await store.updateTestimonial(id, req.body);

    if (!updated) {
      res.status(404).json({
        success: false,
        message: 'Testimonial not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update testimonial.',
      error: error.message,
    });
  }
};

export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const deleted = await store.deleteTestimonial(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Testimonial not found or already deleted.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial.',
      error: error.message,
    });
  }
};
