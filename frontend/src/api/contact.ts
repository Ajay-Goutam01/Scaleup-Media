import { apiRequest } from './client';
import { ContactSettings } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

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

  uploadFounderPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    const token = localStorage.getItem('scaleup_admin_token');
    const response = await fetch(`${API_URL}/contact/founder-photo`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return response.json();
  },

  removeFounderPhoto: async () => {
    return apiRequest<ContactSettings>('/contact/founder-photo', { method: 'DELETE' });
  },
};
