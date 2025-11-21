import axios from 'axios';
import type { CancelToken } from 'axios';
import apiClient from '../config/apiClient';
import { ApiClientError } from '../lib/apiClientError';
import type { ApiErrorResponse } from '../types/api.types';
import type {
  LoginPayload,
  LoginResult,
  RegisterPayload,
  RegisterResult,
  RefreshResult,
  UserRole,
} from '../types/auth.types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const login = async (
  payload: LoginPayload,
  cancelToken?: CancelToken
): Promise<LoginResult> => {
  try {
    const res = await axios.post(
      `${BASE_URL}/auth/login`,
      payload,
      { withCredentials: true, cancelToken }
    );

    const data = res.data;
    return {
      user: data.user,
      accessToken: data.accessToken,
      message: data.message,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data = err.response?.data as ApiErrorResponse | undefined;
      throw new ApiClientError(data?.message || err.message, status, data);
    }
    throw err;
  }
};

export const register = async (
  payload: RegisterPayload,
  cancelToken?: CancelToken
): Promise<RegisterResult> => {
  try {
    const res = await axios.post(
      `${BASE_URL}/auth/register`,
      payload,
      { withCredentials: true, cancelToken }
    );

    const data = res.data;
    return {
      user: data.user,
      message: data.message,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data = err.response?.data as ApiErrorResponse | undefined;
      throw new ApiClientError(data?.message || err.message, status, data);
    }
    throw err;
  }
};

export const refresh = async (): Promise<RefreshResult> => {
  const res = await axios.post(
    `${BASE_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  );
  const data = res.data;
  return {
    user: data.user,
    accessToken: data.accessToken,
    message: data.message,
  };
};

export interface MeResult {
  id: string;
  role: UserRole;
}

export const me = async (cancelToken?: CancelToken): Promise<MeResult> => {
  try {
    const res = await apiClient.get('/auth/me', { cancelToken });
    const data = res.data as {
      success: boolean;
      message: string;
      data: { id: string; role: UserRole };
    };
    return data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data = err.response?.data as ApiErrorResponse | undefined;
      throw new ApiClientError(data?.message || err.message, status, data);
    }
    throw err;
  }
};

export const logout = async (): Promise<void> => {
  await axios.post(
    `${BASE_URL}/auth/logout`,
    {},
    { withCredentials: true }
  );
};
