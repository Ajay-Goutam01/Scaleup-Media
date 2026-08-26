import { apiRequest } from './client';
import { Branding } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const brandingApi = {
  get: async () => {
    return apiRequest<Branding>('/branding');
  },

  update: async (data: Partial<Branding>) => {
    return apiRequest<Branding>('/branding', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  uploadLogo: async (file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    const token = localStorage.getItem('scaleup_admin_token');
    const response = await fetch(`${API_URL}/branding/logo`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return response.json();
  },

  removeLogo: async () => {
    return apiRequest<Branding>('/branding/logo', { method: 'DELETE' });
  },

  uploadFavicon: async (file: File) => {
    const formData = new FormData();
    formData.append('favicon', file);
    const token = localStorage.getItem('scaleup_admin_token');
    const response = await fetch(`${API_URL}/branding/favicon`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return response.json();
  },

  removeFavicon: async () => {
    return apiRequest<Branding>('/branding/favicon', { method: 'DELETE' });
  },
};
