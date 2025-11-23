import React, { useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Login from '../pages/auth/Login';
import Registration from '../pages/auth/Registration';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import type { AuthUser } from '../types/auth.types';
// import UserDashboard from '../pages/dashboard/UserDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminCategories from '../pages/admin/AdminCategories';
import { useAuth } from '../hooks/useAuth';
import AdminBanners from '../pages/admin/AdminBanners';
import AccountSettings from '../pages/settings/AccountSettings';
import UserDashboard from '../pages/user/UserDashboard';
import UserArticlesPage from '../pages/user/UserArticles';

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLoginSuccess = useCallback(
    (user: AuthUser) => {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/user', { replace: true });
      }
    },
    [navigate]
  );

  const handleRegisterSuccess = useCallback(() => {
    navigate('/auth/login', { replace: true });
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/auth/login', { replace: true });
  }, [logout, navigate]);

  return (
    <Routes>
      {/* Public auth routes */}
      <Route element={<PublicRoute />}>
        <Route
          path="/auth/login"
          element={
            <Login
              onLogin={handleLoginSuccess}
              onNavigateToRegister={() => navigate('/auth/register')}
            />
          }
        />
        <Route
          path="/auth/register"
          element={
            <Registration
              onRegister={handleRegisterSuccess}
              onNavigateToLogin={() => navigate('/auth/login')}
            />
          }
        />
      </Route>

      {/* User routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/user"
          element={
            <UserDashboard
              onLogout={handleLogout}
            />
          }
        />
        <Route
          path="/user/articles"
          element={<UserArticlesPage onLogout={handleLogout} />}
        />
        <Route
          path="/user/settings"
          element={<AccountSettings onLogout={handleLogout} />}
        />
      </Route>

      {/* Admin-only routes */}
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route
          path="/admin"
          element={<AdminDashboard onLogout={handleLogout} />}
        />
        <Route
          path="/admin/categories"
          element={<AdminCategories onLogout={handleLogout} />}
        />
        <Route
          path="/admin/banners"
          element={<AdminBanners onLogout={handleLogout} />}
        />
        <Route
          path="/admin/settings"
          element={<AccountSettings onLogout={handleLogout} />}
        />
      </Route>
      

      {/* Default + fallback */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
