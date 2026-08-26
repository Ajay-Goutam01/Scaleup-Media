import { apiRequest } from './client';
import { ContactSettings } from '../types';

export const contactApi = {
  get: async () => {
    return apiRequest<ContactSettings>('/contact');
  },

  update: async (settings: Partial<ContactSettings>) => {
    return apiRequest<ContactSettings>('/contact', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};
