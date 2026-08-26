import { apiRequest } from './client';
import { DashboardStats } from '../types';

export const statsApi = {
  get: async () => {
    return apiRequest<DashboardStats>('/stats');
  },
};
