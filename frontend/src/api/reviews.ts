import { apiRequest } from './client';
import { Review } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const reviewsApi = {
  // Public: submit a review (FormData for optional image upload)
  submit: async (formData: FormData): Promise<{ success: boolean; message?: string }> => {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  // Public: get only approved reviews
  getPublic: async () => {
    return apiRequest<Review[]>('/reviews/public');
  },

  // Admin: get all reviews
  getAdmin: async (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return apiRequest<Review[]>(`/reviews/admin${query}`);
  },

  // Admin: approve
  approve: async (id: string, marqueeRow: 1 | 2 = 1) => {
    return apiRequest<Review>(`/reviews/admin/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ marqueeRow }),
    });
  },

  // Admin: reject
  reject: async (id: string) => {
    return apiRequest<Review>(`/reviews/admin/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({}),
    });
  },

  // Admin: unpublish
  unpublish: async (id: string) => {
    return apiRequest<Review>(`/reviews/admin/${id}/unpublish`, {
      method: 'PUT',
      body: JSON.stringify({}),
    });
  },

  // Admin: delete
  delete: async (id: string) => {
    return apiRequest<null>(`/reviews/admin/${id}`, { method: 'DELETE' });
  },
};
