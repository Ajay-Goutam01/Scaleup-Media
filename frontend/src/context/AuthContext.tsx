import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';
import { AdminUser } from '../types';

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mustChangePassword: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearMustChangePassword: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('scaleup_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('scaleup_admin_token');
  });
  const [mustChangePassword, setMustChangePassword] = useState<boolean>(() => {
    return localStorage.getItem('scaleup_must_change_pwd') === 'true';
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('scaleup_admin_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authApi.getMe();
        if (response.success && response.admin) {
          setAdmin(response.admin);
          const mcp = (response.admin as any).mustChangePassword || false;
          setMustChangePassword(mcp);
          localStorage.setItem('scaleup_admin_user', JSON.stringify(response.admin));
          localStorage.setItem('scaleup_must_change_pwd', String(mcp));
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.token && res.admin) {
        setToken(res.token);
        setAdmin(res.admin);
        const mcp = res.mustChangePassword || (res.admin as any).mustChangePassword || false;
        setMustChangePassword(mcp);
        localStorage.setItem('scaleup_admin_token', res.token);
        localStorage.setItem('scaleup_admin_user', JSON.stringify(res.admin));
        localStorage.setItem('scaleup_must_change_pwd', String(mcp));
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    setMustChangePassword(false);
    localStorage.removeItem('scaleup_admin_token');
    localStorage.removeItem('scaleup_admin_user');
    localStorage.removeItem('scaleup_must_change_pwd');
    authApi.logout().catch(() => {});
  };

  const clearMustChangePassword = () => {
    setMustChangePassword(false);
    localStorage.removeItem('scaleup_must_change_pwd');
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: Boolean(token && admin),
        isLoading,
        mustChangePassword,
        login,
        logout,
        clearMustChangePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
