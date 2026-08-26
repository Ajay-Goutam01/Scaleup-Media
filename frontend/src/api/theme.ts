import { apiRequest } from './client';
import { ThemeSettings } from '../types';

export const themeApi = {
  get: async () => {
    return apiRequest<ThemeSettings>('/theme');
  },

  update: async (data: Partial<ThemeSettings> & { preset?: string; reset?: boolean }) => {
    return apiRequest<ThemeSettings>('/theme', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
