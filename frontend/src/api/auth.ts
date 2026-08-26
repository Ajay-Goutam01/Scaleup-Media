import { apiRequest } from './client';
import { AdminUser } from '../types';

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    return apiRequest<{ admin: AdminUser; token: string; mustChangePassword?: boolean }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getMe: async () => {
    return apiRequest<{ admin: AdminUser }>('/auth/me');
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    return apiRequest<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  changeEmail: async (data: { newEmail: string; currentPassword: string }) => {
    return apiRequest<{ message: string }>('/auth/change-email', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
