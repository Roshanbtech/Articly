// src/services/category.service.ts
import axios, { type CancelToken } from 'axios';
import apiClient from '../config/apiClient';
import { ApiClientError } from '../lib/apiClientError';
import type { ApiErrorResponse } from '../types/api.types';
import type {
  Category,
  AdminCategory,
  AdminCategoryListResponse,
} from '../types/category.types';

interface ListCategoriesParams {
  page?: number;
  limit?: number;
}

/**
 * PUBLIC categories (used for signup/preferences/etc).
 * GET /categories
 */
export const listCategories = async (
  params: ListCategoriesParams = { page: 1, limit: 50 },
  cancelToken?: CancelToken
): Promise<Category[]> => {
  try {
    const res = await apiClient.get('/categories', {
      params,
      cancelToken,
    });

    const raw = res.data as any;

    let rawItems: any[] = [];

    if (Array.isArray(raw)) {
      rawItems = raw;
    } else if (Array.isArray(raw?.categories)) {
      rawItems = raw.categories;
    } else if (Array.isArray(raw?.data?.categories)) {
      rawItems = raw.data.categories;
    } else if (Array.isArray(raw?.data)) {
      rawItems = raw.data;
    } else if (Array.isArray(raw?.results)) {
      rawItems = raw.results;
    }

    const categories: Category[] = (rawItems ?? []).map((c: any) => ({
      id: c.id ?? c._id,
      name: c.name,
      description: c.description ?? '',
      iconUrl: c.iconUrl ?? '',
    }));

    return categories;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.code === 'ERR_CANCELED') {
        throw err;
      }

      console.error('listCategories request failed', {
        url: '/categories',
        status: err.response?.status,
        data: err.response?.data,
      });

      const status = err.response?.status;
      const data = err.response?.data as ApiErrorResponse | undefined;
      throw new ApiClientError(data?.message || err.message, status, data);
    }

    console.error('listCategories unexpected error', err);
    throw err;
  }
};

// ---------------------------------------------------------------------------
// Admin category helpers
// ---------------------------------------------------------------------------

interface ListAdminCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: 'true' | 'false';
}

interface CategoryPayload {
  name: string;
  description?: string;
  iconFile?: File | null;
}

const mapAdminCategory = (c: any): AdminCategory => ({
  id: c.id ?? c._id,
  name: c.name,
  description: c.description ?? '',
  iconUrl: c.iconUrl ?? '',
  isActive: Boolean(c.isActive),
  createdAt: c.createdAt ?? '',
  updatedAt: c.updatedAt ?? '',
  createdBy:
    typeof c.createdBy === 'string'
      ? c.createdBy
      : c.createdBy?._id ?? undefined,
});

const buildCategoryFormData = (payload: CategoryPayload): FormData => {
  const form = new FormData();
  form.append('name', payload.name);
  if (payload.description !== undefined) {
    form.append('description', payload.description);
  }
  if (payload.iconFile) {
    // field name must match multer field: "iconUrl"
    form.append('iconUrl', payload.iconFile);
  }
  return form;
};

/**
 * ADMIN list with pagination/filter/search
 * GET /categories/admin
 */
export const listAdminCategories = async (
  params: ListAdminCategoriesParams = { page: 1, limit: 10 },
  cancelToken?: CancelToken
): Promise<AdminCategoryListResponse> => {
  try {
    const res = await apiClient.get('/categories/admin', {
      params,
      cancelToken,
    });

    const raw = res.data as any;
    const rawItems: any[] = Array.isArray(raw?.categories)
      ? raw.categories
      : [];

    const categories: AdminCategory[] = rawItems.map(mapAdminCategory);

    const pagination =
      raw.pagination ?? ({
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        total: categories.length,
        totalPages: 1,
      } as AdminCategoryListResponse['pagination']);

    return {
      success: Boolean(raw?.success ?? true),
      categories,
      pagination,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.code === 'ERR_CANCELED') throw err;

      console.error('listAdminCategories request failed', {
        url: '/categories/admin',
        status: err.response?.status,
        data: err.response?.data,
      });

      const status = err.response?.status;
      const data = err.response?.data as ApiErrorResponse | undefined;
      throw new ApiClientError(data?.message || err.message, status, data);
    }

    console.error('listAdminCategories unexpected error', err);
    throw err;
  }
};

/**
 * ADMIN get by id
 * GET /categories/:id
 */
export const getAdminCategoryById = async (
  id: string,
  cancelToken?: CancelToken
): Promise<AdminCategory> => {
  try {
    const res = await apiClient.get(`/categories/${id}`, {
      cancelToken,
    });

    const raw = res.data as any;
    const c = raw?.category;
    if (!c) {
      throw new ApiClientError('Category not found', 404, raw);
    }
    return mapAdminCategory(c);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.code === 'ERR_CANCELED') throw err;

      const status = err.response?.status;
      const data = err.response?.data as ApiErrorResponse | undefined;
      throw new ApiClientError(data?.message || err.message, status, data);
    }

    throw err;
  }
};

/**
 * ADMIN create category (multipart form).
 * POST /categories
 */
export const createAdminCategory = async (
  payload: CategoryPayload,
  cancelToken?: CancelToken
): Promise<AdminCategory> => {
  try {
    const formData = buildCategoryFormData(payload);

    const res = await apiClient.post('/categories', formData, {
      cancelToken,
    });

    const raw = res.data as any;
    const c = raw?.category ?? raw?.data ?? raw;
    return mapAdminCategory(c);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.code === 'ERR_CANCELED') throw err;

      const status = err.response?.status;
      const data = err.response?.data as ApiErrorResponse | undefined;
      throw new ApiClientError(data?.message || err.message, status, data);
    }

    throw err;
  }
};

/**
 * ADMIN update category (supports icon upload)
 * PATCH /categories/:id
 */
export const updateAdminCategory = async (
  id: string,
  payload: CategoryPayload,
  cancelToken?: CancelToken
): Promise<AdminCategory> => {
  try {
    const formData = buildCategoryFormData(payload);

    const res = await apiClient.patch(`/categories/${id}`, formData, {
      cancelToken,
    });

    const raw = res.data as any;
    const c = raw?.category ?? raw?.data ?? raw;
    return mapAdminCategory(c);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.code === 'ERR_CANCELED') throw err;

      const status = err.response?.status;
      const data = err.response?.data as ApiErrorResponse | undefined;
      throw new ApiClientError(data?.message || err.message, status, data);
    }

    throw err;
  }
};

/**
 * ADMIN toggle isActive
 * PATCH /categories/:id/toggle
 */
export const toggleAdminCategory = async (
  id: string,
  cancelToken?: CancelToken
): Promise<AdminCategory> => {
  try {
    const res = await apiClient.patch(`/categories/${id}/toggle`, {}, {
      cancelToken,
    });

    const raw = res.data as any;
    const c = raw?.category ?? raw?.data ?? raw;
    return mapAdminCategory(c);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.code === 'ERR_CANCELED') throw err;

      const status = err.response?.status;
      const data = err.response?.data as ApiErrorResponse | undefined;
      throw new ApiClientError(data?.message || err.message, status, data);
    }

    throw err;
  }
};
