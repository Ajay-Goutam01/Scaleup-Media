import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { useLenis } from './hooks/useLenis';

import { HomePage } from './pages/HomePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminChangePasswordPage } from './pages/admin/AdminChangePasswordPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';
import { AdminSectionsPage } from './pages/admin/AdminSectionsPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminContactPage } from './pages/admin/AdminContactPage';
import { AdminAppearancePage } from './pages/admin/AdminAppearancePage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';

// Loading spinner
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--theme-bg)' }}>
    <div
      className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
      style={{ borderColor: 'var(--theme-primary)', borderTopColor: 'transparent' }}
    />
  </div>
);

// Protected Route wrapper — also enforces mustChangePassword redirect
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, mustChangePassword } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Force password change before any other admin page
  if (mustChangePassword) {
    return <Navigate to="/admin/change-password" replace />;
  }

  return <>{children}</>;
};

// Change Password Route — accessible when authenticated but must change password
const ChangePasswordRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminChangePasswordPage />;
};

const AppRoutes: React.FC = () => {
  // Activate Lenis smooth scroll across the app
  useLenis();

  return (
    <Routes>
      {/* Public Agency Website */}
      <Route path="/" element={<HomePage />} />
      <Route path="/projects/:id" element={<ProjectDetailPage />} />

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin First-Login Password Change (semi-protected) */}
      <Route path="/admin/change-password" element={<ChangePasswordRoute />} />

      {/* Protected Admin CMS Dashboard Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminDashboardPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/projects"
        element={
          <ProtectedAdminRoute>
            <AdminProjectsPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <ProtectedAdminRoute>
            <AdminServicesPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/testimonials"
        element={
          <ProtectedAdminRoute>
            <AdminTestimonialsPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/sections"
        element={
          <ProtectedAdminRoute>
            <AdminSectionsPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/content"
        element={
          <ProtectedAdminRoute>
            <AdminContentPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/contact"
        element={
          <ProtectedAdminRoute>
            <AdminContactPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/appearance"
        element={
          <ProtectedAdminRoute>
            <AdminAppearancePage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedAdminRoute>
            <AdminReviewsPage />
          </ProtectedAdminRoute>
        }
      />

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <SettingsProvider>
            <AppRoutes />
          </SettingsProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
