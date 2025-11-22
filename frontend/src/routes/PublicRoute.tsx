// src/routes/PublicRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';

const PublicRoute: React.FC = () => {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader />
      </div>
    );
  }

  if (user) {
    const target = user.role === 'admin' ? '/admin' : '/user';

    if (location.pathname.startsWith('/auth')) {
      return <Navigate to={target} replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;
