// src/hooks/useMyArticles.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import axios, { type CancelTokenSource } from 'axios';
import { createCancelTokenSource } from '../config/apiClient';
import { useDebounce } from './useDebounce';
import type { Article } from '../types/article.types';
import {
  listMyArticles,
  type ListMyArticlesParams,
} from '../services/article.service';

export interface UseMyArticlesOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
}

export interface UseMyArticlesResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  search: string;
  setPage: (page: number) => void;
  setSearch: (value: string) => void;
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  reload: () => void;
}

export function useMyArticles(
  options: UseMyArticlesOptions = {}
): UseMyArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(options.initialPage ?? 1);
  const [limit] = useState(options.initialLimit ?? 10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState(options.initialSearch ?? '');
  const debouncedSearch = useDebounce(search, 500);
  const cancelRef = useRef<CancelTokenSource | null>(null);

  const load = useCallback(() => {
    cancelRef.current?.cancel('Reload my articles');
    const src = createCancelTokenSource();
    cancelRef.current = src;

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const params: ListMyArticlesParams = {
          page,
          limit,
          search: debouncedSearch.trim() || undefined,
        };

        const res = await listMyArticles(params, src.token);
        setArticles(res.articles);
        setTotal(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error('Failed to load my articles', err);
        setError('Failed to load your articles. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    load();
    return () => cancelRef.current?.cancel('My articles unmounted');
  }, [load]);

  return {
    articles,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    search,
    setPage,
    setSearch: (value: string) => {
      setPage(1);
      setSearch(value);
    },
    setArticles,
    reload: load,
  };
}
