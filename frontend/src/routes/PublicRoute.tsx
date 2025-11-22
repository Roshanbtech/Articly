import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/user" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
