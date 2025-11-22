// src/hooks/useArticleFeed.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import axios, { type CancelTokenSource } from 'axios';
import { createCancelTokenSource } from '../config/apiClient';
import { useDebounce } from './useDebounce';
import type { Article } from '../types/article.types';
import {
  listFeedArticles,
  type ListFeedArticlesParams,
} from '../services/article.service';

export interface UseArticleFeedOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  initialCategoryId?: string;
}

export interface UseArticleFeedResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  search: string;
  categoryId: string | null;
  setPage: (page: number) => void;
  setSearch: (value: string) => void;
  setCategoryId: (categoryId: string | null) => void;
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  reload: () => void;
}

export function useArticleFeed(
  options: UseArticleFeedOptions = {}
): UseArticleFeedResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(options.initialPage ?? 1);
  const [limit] = useState(options.initialLimit ?? 9);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState(options.initialSearch ?? '');
  const [categoryId, setCategoryId] = useState<string | null>(
    options.initialCategoryId ?? null
  );

  const debouncedSearch = useDebounce(search, 500);
  const cancelRef = useRef<CancelTokenSource | null>(null);

  const load = useCallback(() => {
    cancelRef.current?.cancel('Reload article feed');
    const src = createCancelTokenSource();
    cancelRef.current = src;

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const params: ListFeedArticlesParams = {
          page,
          limit,
          search: debouncedSearch.trim() || undefined,
          category: categoryId || undefined,
        };

        const res = await listFeedArticles(params, src.token);

        setArticles(res.articles);
        setTotal(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error('Failed to load article feed', err);
        setError('Failed to load articles. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [page, limit, debouncedSearch, categoryId]);

  useEffect(() => {
    load();
    return () => cancelRef.current?.cancel('Article feed unmounted');
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
    categoryId,
    setPage,
    setSearch: (value: string) => {
      setPage(1);
      setSearch(value);
    },
    setCategoryId: (value: string | null) => {
      setPage(1);
      setCategoryId(value);
    },
    setArticles,
    reload: load,
  };
}
