import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { useLenis } from './hooks/useLenis';

import { HomePage } from './pages/HomePage';

// Route-level code splitting for non-homepage views
const ProjectDetailPage = lazy(() =>
  import('./pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

const AdminLoginPage = lazy(() =>
  import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage }))
);
const AdminChangePasswordPage = lazy(() =>
  import('./pages/admin/AdminChangePasswordPage').then((m) => ({
    default: m.AdminChangePasswordPage,
  }))
);
const AdminDashboardPage = lazy(() =>
  import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);
const AdminProjectsPage = lazy(() =>
  import('./pages/admin/AdminProjectsPage').then((m) => ({ default: m.AdminProjectsPage }))
);
const AdminServicesPage = lazy(() =>
  import('./pages/admin/AdminServicesPage').then((m) => ({ default: m.AdminServicesPage }))
);
const AdminTestimonialsPage = lazy(() =>
  import('./pages/admin/AdminTestimonialsPage').then((m) => ({
    default: m.AdminTestimonialsPage,
  }))
);
const AdminSectionsPage = lazy(() =>
  import('./pages/admin/AdminSectionsPage').then((m) => ({ default: m.AdminSectionsPage }))
);
const AdminContentPage = lazy(() =>
  import('./pages/admin/AdminContentPage').then((m) => ({ default: m.AdminContentPage }))
);
const AdminContactPage = lazy(() =>
  import('./pages/admin/AdminContactPage').then((m) => ({ default: m.AdminContactPage }))
);
const AdminAppearancePage = lazy(() =>
  import('./pages/admin/AdminAppearancePage').then((m) => ({ default: m.AdminAppearancePage }))
);
const AdminReviewsPage = lazy(() =>
  import('./pages/admin/AdminReviewsPage').then((m) => ({ default: m.AdminReviewsPage }))
);

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
    <Suspense fallback={<LoadingSpinner />}>
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
    </Suspense>
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
