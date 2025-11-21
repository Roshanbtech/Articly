import { useAuthStore } from '../store/auth.store';

export const useAuth = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
    initializing,
    login,
    register,
    logout,
    loadSession,
  } = useAuthStore();

  return {
    user,
    accessToken,
    isAuthenticated,
    initializing,
    login,
    register,
    logout,
    loadSession,
  };
};
