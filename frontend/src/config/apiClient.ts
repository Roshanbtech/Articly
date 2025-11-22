// src/config/apiClient.ts
import axios from 'axios';
import type {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from 'axios';
import { useAuthStore } from '../store/auth.store';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true, 
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        (config.headers as any).Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshQueue: {
  resolve: (token?: string | null) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  refreshQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  refreshQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;

    if (!originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register')
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // If a refresh is already in-flight, enqueue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token) => {
            if (token) {
              originalRequest.headers = originalRequest.headers || {};
              (originalRequest.headers as any).Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const res = await axios.post(
        (import.meta.env.VITE_API_BASE_URL || '/api') + '/auth/refresh',
        {},
        { withCredentials: true }
      );

      const data = res.data as {
        accessToken: string;
        user?: any;
      };

      const newToken = data.accessToken;

      const { setAuth, user } = useAuthStore.getState();
      setAuth({
        user: data.user || user || null,
        accessToken: newToken,
      });

      processQueue(null, newToken);

      originalRequest.headers = originalRequest.headers || {};
      (originalRequest.headers as any).Authorization = `Bearer ${newToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      // Clear auth if refresh fails
      useAuthStore.getState().clearAuth();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const createCancelTokenSource = (): CancelTokenSource =>
  axios.CancelToken.source();

export default apiClient;
