import { Request, Response } from 'express';
import { store } from '../services/store';
import { uploadToImageKit } from '../config/imagekit';

// Spam prevention: track recent IPs (simple in-memory, resets on restart)
const recentSubmissions = new Map<string, number>();
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes between submissions from same IP

/**
 * POST /api/reviews — Public: submit a new review
 */
export const submitReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';

    // Spam check: same IP must wait 5 minutes between submissions
    const lastSubmit = recentSubmissions.get(ip);
    if (lastSubmit && Date.now() - lastSubmit < COOLDOWN_MS) {
      res.status(429).json({
        success: false,
        message: 'Please wait a few minutes before submitting another review.',
      });
      return;
    }

    const { name, company, email, review, rating, marqueeRow } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
      return;
    }
    if (!review || typeof review !== 'string' || review.trim().length < 20) {
      res.status(400).json({ success: false, message: 'Review must be at least 20 characters.' });
      return;
    }
    if (review.trim().length > 1500) {
      res.status(400).json({ success: false, message: 'Review cannot exceed 1500 characters.' });
      return;
    }
    const ratingNum = Number(rating);
    if (!rating || isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
      return;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(String(email))) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    // Handle optional profile image
    let profileImageUrl = '';
    let profileImageFileId = '';
    if (req.file) {
      try {
        const uploaded = await uploadToImageKit(
          req.file.path,
          'scaleup-media/reviews',
          req.file.originalname
        );
        profileImageUrl = uploaded.url;
        profileImageFileId = uploaded.fileId;
      } catch (uploadErr) {
        console.warn('[Review] Profile image upload failed, continuing without image');
      }
    }

    const newReview = await store.createReview({
      name: name.trim(),
      company: company ? String(company).trim() : '',
      email: email ? String(email).trim().toLowerCase() : undefined,
      review: review.trim(),
      rating: ratingNum,
      profileImageUrl,
      profileImageFileId,
      status: 'pending',
      featured: false,
      marqueeRow: marqueeRow === 2 ? 2 : 1,
      order: 0,
      submittedIp: ip,
    });

    // Record IP timestamp
    recentSubmissions.set(ip, Date.now());
    // Clean up old entries
    if (recentSubmissions.size > 1000) {
      const now = Date.now();
      for (const [k, v] of recentSubmissions.entries()) {
        if (now - v > COOLDOWN_MS) recentSubmissions.delete(k);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted and is awaiting approval.',
      data: { id: (newReview as any)._id },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit review.',
      error: error.message,
    });
  }
};

/**
 * GET /api/reviews/public — Public: get approved reviews only
 */
export const getPublicReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await store.getReviews({ status: 'approved' });
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews.',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/reviews — Admin: get all reviews, filterable by status
 */
export const getAdminReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status as string | undefined;
    const reviews = await store.getReviews(status ? { status } : {});
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews.',
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/reviews/:id/approve
 */
export const approveReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { marqueeRow } = req.body;
    const updated = await store.updateReview(id, {
      status: 'approved',
      marqueeRow: marqueeRow === 2 ? 2 : 1,
    });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Review not found.' });
      return;
    }
    res.status(200).json({ success: true, message: 'Review approved.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to approve review.', error: error.message });
  }
};

/**
 * PUT /api/admin/reviews/:id/reject
 */
export const rejectReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const updated = await store.updateReview(id, { status: 'rejected' });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Review not found.' });
      return;
    }
    res.status(200).json({ success: true, message: 'Review rejected.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to reject review.', error: error.message });
  }
};

/**
 * PUT /api/admin/reviews/:id/unpublish
 */
export const unpublishReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const updated = await store.updateReview(id, { status: 'unpublished' });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Review not found.' });
      return;
    }
    res.status(200).json({ success: true, message: 'Review unpublished.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to unpublish review.', error: error.message });
  }
};

/**
 * DELETE /api/admin/reviews/:id
 */
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const deleted = await store.deleteReview(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Review not found.' });
      return;
    }
    res.status(200).json({ success: true, message: 'Review deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete review.', error: error.message });
  }
};
