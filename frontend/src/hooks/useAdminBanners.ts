import { useCallback, useEffect, useRef, useState } from 'react';
import axios, { type CancelTokenSource } from 'axios';
import { createCancelTokenSource } from '../config/apiClient';
import type { AdminBanner } from '../types/banner.types';
import { listAdminBanners } from '../services/banner.service';
import { useDebounce } from './useDebounce';

export type BannerStatusFilter = 'all' | 'active' | 'inactive';

interface UseAdminBannersOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  initialStatus?: BannerStatusFilter;
}

interface UseAdminBannersResult {
  banners: AdminBanner[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  search: string;
  status: BannerStatusFilter;
  setPage: (page: number) => void;
  setSearch: (value: string) => void;
  setStatus: (status: BannerStatusFilter) => void;
  reload: () => void;
}

export function useAdminBanners(
  options: UseAdminBannersOptions = {}
): UseAdminBannersResult {
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(options.initialPage ?? 1);
  const [limit] = useState<number>(options.initialLimit ?? 10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [search, setSearch] = useState<string>(options.initialSearch ?? '');
  const [status, setStatus] = useState<BannerStatusFilter>(
    options.initialStatus ?? 'all'
  );

  const debouncedSearch = useDebounce(search, 500);
  const cancelRef = useRef<CancelTokenSource | null>(null);

  const load = useCallback(() => {
    cancelRef.current?.cancel('Reload admin banners');
    const src = createCancelTokenSource();
    cancelRef.current = src;

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await listAdminBanners(
          {
            page,
            limit,
            search: debouncedSearch.trim() || undefined,
            isActive:
              status === 'active'
                ? 'true'
                : status === 'inactive'
                ? 'false'
                : undefined,
          },
          src.token
        );

        setBanners(res.banners);
        setTotal(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error('Failed to load admin banners', err);
        setError('Failed to load banners. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [page, limit, debouncedSearch, status]);

  useEffect(() => {
    load();

    return () => {
      cancelRef.current?.cancel('Admin banners unmounted');
    };
  }, [load]);

  return {
    banners,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    search,
    status,
    setPage,
    setSearch: (value: string) => {
      setPage(1);
      setSearch(value);
    },
    setStatus: (value: BannerStatusFilter) => {
      setPage(1);
      setStatus(value);
    },
    reload: load,
  };
}
