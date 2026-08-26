import { apiRequest } from './client';

export const uploadApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest<{ url: string }>('/upload', {
      method: 'POST',
      body: formData,
    });
  },

  uploadMultipleImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    return apiRequest<{ urls: string[] }>('/upload/multiple', {
      method: 'POST',
      body: formData,
    });
  },
};
