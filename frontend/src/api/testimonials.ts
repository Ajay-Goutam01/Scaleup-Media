import { apiRequest } from './client';
import { Testimonial } from '../types';

export const testimonialsApi = {
  getAll: async (params?: { activeOnly?: boolean; public?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.activeOnly) query.append('activeOnly', 'true');
    if (params?.public) query.append('public', 'true');
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<Testimonial[]>(`/testimonials${queryString}`);
  },

  create: async (testimonialData: Partial<Testimonial>) => {
    return apiRequest<Testimonial>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonialData),
    });
  },

  update: async (id: string, testimonialData: Partial<Testimonial>) => {
    return apiRequest<Testimonial>(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonialData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/testimonials/${id}`, {
      method: 'DELETE',
    });
  },
};
