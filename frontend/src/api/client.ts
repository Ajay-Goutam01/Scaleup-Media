const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  admin?: any;
  mustChangePassword?: boolean;
  count?: number;
  url?: string;
  urls?: string[];
  error?: string;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('scaleup_admin_token');

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // If unauthorized on admin endpoint, clear local storage
        if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
          localStorage.removeItem('scaleup_admin_token');
          localStorage.removeItem('scaleup_admin_user');
          window.location.href = '/admin/login';
        }
      }
      throw new Error(data.message || `API error: ${response.statusText}`);
    }

    return data;
  } catch (error: any) {
    console.error(`[API Request Error] ${endpoint}:`, error);
    throw error;
  }
}
