import { apiRequest } from './client';
import { SectionSettings } from '../types';

export const sectionsApi = {
  get: async () => {
    return apiRequest<SectionSettings>('/sections');
  },

  update: async (settings: Partial<SectionSettings>) => {
    return apiRequest<SectionSettings>('/sections', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};
