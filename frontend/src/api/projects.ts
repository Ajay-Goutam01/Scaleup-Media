import { apiRequest } from './client';
import { Project } from '../types';

export const projectsApi = {
  getAll: async (params?: { activeOnly?: boolean; featuredOnly?: boolean; public?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.activeOnly) query.append('activeOnly', 'true');
    if (params?.featuredOnly) query.append('featuredOnly', 'true');
    if (params?.public) query.append('public', 'true');
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<Project[]>(`/projects${queryString}`);
  },

  getByIdOrSlug: async (idOrSlug: string) => {
    return apiRequest<Project>(`/projects/${idOrSlug}`);
  },

  create: async (projectData: Partial<Project>) => {
    return apiRequest<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  update: async (id: string, projectData: Partial<Project>) => {
    return apiRequest<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};
