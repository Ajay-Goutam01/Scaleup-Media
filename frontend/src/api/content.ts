import { apiRequest } from './client';
import { WebsiteContent } from '../types';

export const contentApi = {
  get: async () => {
    return apiRequest<WebsiteContent>('/content');
  },

  update: async (content: Partial<WebsiteContent>) => {
    return apiRequest<WebsiteContent>('/content', {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  },
};
