import { apiRequest } from './client';
import { Service } from '../types';

export const servicesApi = {
  getAll: async (params?: { activeOnly?: boolean; public?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.activeOnly) query.append('activeOnly', 'true');
    if (params?.public) query.append('public', 'true');
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<Service[]>(`/services${queryString}`);
  },

  create: async (serviceData: Partial<Service>) => {
    return apiRequest<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  },

  update: async (id: string, serviceData: Partial<Service>) => {
    return apiRequest<Service>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/services/${id}`, {
      method: 'DELETE',
    });
  },
};
