// src/hooks/useAdminCategories.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import axios, { type CancelTokenSource } from 'axios';
import { createCancelTokenSource } from '../config/apiClient';
import type { AdminCategory } from '../types/category.types';
import { listAdminCategories } from '../services/category.service';
import { useDebounce } from './useDebounce';

export type CategoryStatusFilter = 'all' | 'active' | 'inactive';

interface UseAdminCategoriesOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  initialStatus?: CategoryStatusFilter;
}

interface UseAdminCategoriesResult {
  categories: AdminCategory[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  search: string;
  status: CategoryStatusFilter;
  setPage: (page: number) => void;
  setSearch: (value: string) => void;
  setStatus: (status: CategoryStatusFilter) => void;
  reload: () => void;
}

export function useAdminCategories(
  options: UseAdminCategoriesOptions = {}
): UseAdminCategoriesResult {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(options.initialPage ?? 1);
  const [limit] = useState<number>(options.initialLimit ?? 10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [search, setSearch] = useState<string>(options.initialSearch ?? '');
  const [status, setStatus] = useState<CategoryStatusFilter>(
    options.initialStatus ?? 'all'
  );

  const debouncedSearch = useDebounce(search, 500);
  const cancelRef = useRef<CancelTokenSource | null>(null);

  const load = useCallback(() => {
    cancelRef.current?.cancel('Reload admin categories');
    const src = createCancelTokenSource();
    cancelRef.current = src;

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await listAdminCategories(
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

        setCategories(res.categories);
        setTotal(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error('Failed to load admin categories', err);
        setError('Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [page, limit, debouncedSearch, status]);

  useEffect(() => {
    load();

    return () => {
      cancelRef.current?.cancel('Admin categories unmounted');
    };
  }, [load]);

  return {
    categories,
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
    setStatus: (value: CategoryStatusFilter) => {
      setPage(1);
      setStatus(value);
    },
    reload: load,
  };
}
