// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import type { UserRole } from '../types/auth.types';

interface ProtectedRouteProps {
  roles?: UserRole[]; // optional role filter
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const { user, initializing } = useAuth();
  const location = useLocation();

  // 1) While auth is bootstrapping, block navigation and show loader
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader />
      </div>
    );
  }

  // 2) Not logged in → always go to login, but remember where we came from
  if (!user) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // 3) Role-based protection (admin routes)
  if (roles && !roles.includes(user.role)) {
    const fallback = user.role === 'admin' ? '/admin' : '/user';

    // Avoid infinite loops if we’re already at fallback
    if (location.pathname !== fallback) {
      return <Navigate to={fallback} replace />;
    }
  }

  // 4) Authorized – render the nested route
  return <Outlet />;
};

export default ProtectedRoute;
