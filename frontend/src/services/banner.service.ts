// src/services/banner.service.ts
import axios, { type CancelToken } from 'axios';
import apiClient from '../config/apiClient';
import { ApiClientError } from '../lib/apiClientError';
import type { ApiErrorResponse } from '../types/api.types';
import type {
  Banner,
  BannerListResponse,
  AdminBanner,
  AdminBannerListResponse,
} from '../types/banner.types';

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

const mapBanner = (b: any): Banner => ({
  id: b.id ?? b._id,
  title: b.title,
  description: b.description ?? '',
  imageUrl: b.imageUrl,
  link: b.link ?? '',
});

const mapAdminBanner = (b: any): AdminBanner => ({
  ...mapBanner(b),
  isActive: Boolean(b.isActive),
  createdAt: b.createdAt ?? '',
  updatedAt: b.updatedAt ?? '',
  createdBy:
    typeof b.createdBy === 'string'
      ? b.createdBy
      : b.createdBy?._id ?? undefined,
});

// ---------------------------------------------------------------------------
// Public banners
// ---------------------------------------------------------------------------

/**
 * PUBLIC: list active banners
 * GET /banners/active
 */
export const listActiveBanners = async (
  cancelToken?: CancelToken
): Promise<BannerListResponse> => {
  try {
    const res = await apiClient.get('/banners/active', {
      cancelToken,
    });

    const raw = res.data as any;
    const rawItems: any[] = Array.isArray(raw?.banners) ? raw.banners : [];

    return {
      success: Boolean(raw?.success ?? true),
      banners: rawItems.map(mapBanner),
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.code === 'ERR_CANCELED') throw err;

      console.error('listActiveBanners request failed', {
        url: '/banners/active',
        status: err.response?.status,
        data: err.response?.data,
      });

      const status = err.response?.status;
      const data = err.response?.data as ApiErrorResponse | undefined;
      throw new ApiClientError(data?.message || err.message, status, data);
    }

    console.error('listActiveBanners unexpected error', err);
    throw err;
  }
};

// ---------------------------------------------------------------------------
// Admin banners
// ---------------------------------------------------------------------------

interface ListAdminBannersParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: 'true' | 'false';
}

interface BannerPayload {
  title: string;
  description?: string;
  link?: string;
  imageFile?: File | null;
}

const buildBannerFormData = (payload: BannerPayload): FormData => {
  const form = new FormData();
  form.append('title', payload.title);

  if (payload.description !== undefined) {
    form.append('description', payload.description);
  }

  if (payload.link !== undefined) {
    form.append('link', payload.link);
  }

  if (payload.imageFile) {
    // MUST match multer field name uploadSingleImage("imageUrl")
    form.append('imageUrl', payload.imageFile);
  }

  return form;
};

/**
 * ADMIN list with pagination/filter/search
 * GET /banners
 */
export const listAdminBanners = async (
  params: ListAdminBannersParams = { page: 1, limit: 10 },
  cancelToken?: CancelToken
): Promise<AdminBannerListResponse> => {
  try {
    const res = await apiClient.get('/banners', {
      params,
      cancelToken,
    });

    const raw = res.data as any;
    const rawItems: any[] = Array.isArray(raw?.banners) ? raw.banners : [];

    const banners: AdminBanner[] = rawItems.map(mapAdminBanner);

    const pagination =
      raw.pagination ??
      ({
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        total: banners.length,
        totalPages: 1,
      } as AdminBannerListResponse['pagination']);

    return {
      success: Boolean(raw?.success ?? true),
      banners,
      pagination,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.code === 'ERR_CANCELED') throw err;

      console.error('listAdminBanners request failed', {
        url: '/banners',
        status: err.response?.status,
        data: err.response?.data,
      });

      const status = err.response?.status;
      const data = err.response?.data as ApiErrorResponse | undefined;
      throw new ApiClientError(data?.message || err.message, status, data);
    }

    console.error('listAdminBanners unexpected error', err);
    throw err;
  }
};

/**
 * ADMIN get by id
 * GET /banners/:id
 */
export const getAdminBannerById = async (
  id: string,
  cancelToken?: CancelToken
): Promise<AdminBanner> => {
  try {
    const res = await apiClient.get(`/banners/${id}`, {
      cancelToken,
    });

    const raw = res.data as any;
    const b = raw?.banner;
    if (!b) {
      throw new ApiClientError('Banner not found', 404, raw);
    }
    return mapAdminBanner(b);
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
 * ADMIN create banner (multipart form).
 * POST /banners
 */
export const createAdminBanner = async (
  payload: BannerPayload,
  cancelToken?: CancelToken
): Promise<AdminBanner> => {
  try {
    const formData = buildBannerFormData(payload);

    const res = await apiClient.post('/banners', formData, {
      cancelToken,
    });

    const raw = res.data as any;
    const b = raw?.banner ?? raw?.data ?? raw;
    return mapAdminBanner(b);
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
 * ADMIN update banner (supports image upload)
 * PATCH /banners/:id
 */
export const updateAdminBanner = async (
  id: string,
  payload: BannerPayload,
  cancelToken?: CancelToken
): Promise<AdminBanner> => {
  try {
    const formData = buildBannerFormData(payload);

    const res = await apiClient.patch(`/banners/${id}`, formData, {
      cancelToken,
    });

    const raw = res.data as any;
    const b = raw?.banner ?? raw?.data ?? raw;
    return mapAdminBanner(b);
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
 * PATCH /banners/:id/toggle
 */
export const toggleAdminBanner = async (
  id: string,
  cancelToken?: CancelToken
): Promise<AdminBanner> => {
  try {
    const res = await apiClient.patch(`/banners/${id}/toggle`, {}, {
      cancelToken,
    });

    const raw = res.data as any;
    const b = raw?.banner ?? raw?.data ?? raw;
    return mapAdminBanner(b);
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
