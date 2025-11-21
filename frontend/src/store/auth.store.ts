// src/store/auth.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CancelToken } from 'axios';
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from '../types/auth.types';
import * as authService from '../services/auth.service';
import { toast } from 'sonner';

const AUTH_STORAGE_KEY = 'articly-auth';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  initializing: boolean;

  setAccessToken: (token: string | null) => void;
  setAuth: (payload: { user: AuthUser | null | undefined; accessToken: string | null }) => void;
  clearAuth: () => void;

  login: (
    payload: LoginPayload,
    options?: { cancelToken?: CancelToken }
  ) => Promise<{ user: AuthUser }>;

  register: (
    payload: RegisterPayload,
    options?: { cancelToken?: CancelToken }
  ) => Promise<{ user: AuthUser }>;

  loadSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      initializing: false,

      setAccessToken: (token) =>
        set({
          accessToken: token,
          isAuthenticated: !!token,
        }),

      setAuth: ({ user, accessToken }) =>
        set({
          user: user ?? null,
          accessToken,
          isAuthenticated: !!accessToken,
        }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),

      login: async (payload, options) => {
        const { user, accessToken } = await authService.login(
          payload,
          options?.cancelToken
        );

        set({
          user,
          accessToken,
          isAuthenticated: true,
        });

        return { user };
      },

      // Registration does NOT auto-login
      register: async (payload, options) => {
        const { user } = await authService.register(
          payload,
          options?.cancelToken
        );
        return { user };
      },

      // ✅ New behavior: no refresh call if there is no token
      loadSession: async () => {
        const token = get().accessToken;
        set({ initializing: true });

        if (!token) {
          // no previous session → just show login/register
          set({
            initializing: false,
            isAuthenticated: false,
            user: null,
            accessToken: null,
          });
          return;
        }

        try {
          // This will attach Authorization header automatically.
          // If token is expired, interceptor will do /auth/refresh and retry.
          await authService.me();

          set({
            isAuthenticated: true,
          });
        } catch (error) {
          // could not validate/refresh → wipe local session
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });

          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        } finally {
          set({ initializing: false });
        }
      },

      logout: async () => {
        try {
          await authService.logout();
          toast.success("You have been logged out successfully.");
        } catch(err){
          toast.error("Logout failed. Please try again.");
        } finally {
          get().clearAuth();
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => window.localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);
