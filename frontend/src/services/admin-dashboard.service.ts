import type { CancelToken } from 'axios';
import apiClient from '../config/apiClient';
import type {
  AdminOverviewResponse,
  AdminTopUsersResponse,
  AdminTopCategoriesResponse,
  AdminTopArticlesResponse,
  AdminRecentUsersResponse,
  AdminRecentArticlesResponse,
  AdminUserGrowthResponse,
} from '../types/admin-dashboard.types';

const BASE_PATH = '/admin/dashboard';

export async function getOverview(cancelToken?: CancelToken) {
  const res = await apiClient.get<AdminOverviewResponse>(
    `${BASE_PATH}/overview`,
    { cancelToken }
  );
  return res.data;
}

export async function getTopUsers(limit = 5, cancelToken?: CancelToken) {
  const res = await apiClient.get<AdminTopUsersResponse>(
    `${BASE_PATH}/top-users`,
    {
      params: { limit },
      cancelToken,
    }
  );
  return res.data;
}

export async function getTopCategories(limit = 6, cancelToken?: CancelToken) {
  const res = await apiClient.get<AdminTopCategoriesResponse>(
    `${BASE_PATH}/top-categories`,
    {
      params: { limit },
      cancelToken,
    }
  );
  return res.data;
}

export async function getTopArticles(limit = 5, cancelToken?: CancelToken) {
  const res = await apiClient.get<AdminTopArticlesResponse>(
    `${BASE_PATH}/top-articles`,
    {
      params: { limit },
      cancelToken,
    }
  );
  return res.data;
}

export async function getRecentUsers(limit = 4, cancelToken?: CancelToken) {
  const res = await apiClient.get<AdminRecentUsersResponse>(
    `${BASE_PATH}/recent-users`,
    {
      params: { limit },
      cancelToken,
    }
  );
  return res.data;
}

export async function getRecentArticles(
  limit = 4,
  cancelToken?: CancelToken
) {
  const res = await apiClient.get<AdminRecentArticlesResponse>(
    `${BASE_PATH}/recent-articles`,
    {
      params: { limit },
      cancelToken,
    }
  );
  return res.data;
}

export async function getUserGrowth(
  months = 6,
  cancelToken?: CancelToken
) {
  const res = await apiClient.get<AdminUserGrowthResponse>(
    `${BASE_PATH}/user-growth`,
    {
      params: { months },
      cancelToken,
    }
  );
  return res.data;
}
