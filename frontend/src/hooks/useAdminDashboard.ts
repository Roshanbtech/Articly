import { useEffect, useRef, useState } from 'react';
import type { CancelTokenSource } from 'axios';
import axios from 'axios';

import { createCancelTokenSource } from '../config/apiClient';
import * as adminDashboardService from '../services/admin-dashboard.service';

import type {
  AdminCounts,
  AdminTopUser,
  AdminTopCategory,
  AdminTopArticle,
  AdminRecentUser,
  AdminRecentArticle,
  AdminUserGrowthPoint,
  AdminOverviewUser,
} from '../types/admin-dashboard.types';

interface AdminDashboardData {
  counts: AdminCounts | null;
  userGrowth: AdminUserGrowthPoint[];
  topUsers: AdminTopUser[];
  topCategories: AdminTopCategory[];
  topArticles: AdminTopArticle[];
  recentUsers: AdminRecentUser[];
  recentArticles: AdminRecentArticle[];
  overviewRecentUsers: AdminOverviewUser[];
}

interface UseAdminDashboardResult {
  data: AdminDashboardData | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useAdminDashboard(monthsBack = 6): UseAdminDashboardResult {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cancelSourceRef = useRef<CancelTokenSource | null>(null);

  const load = () => {
    cancelSourceRef.current?.cancel('Reloading admin dashboard');
    const src = createCancelTokenSource();
    cancelSourceRef.current = src;

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const [
          overview,
          userGrowthRes,
          topUsersRes,
          topCategoriesRes,
          topArticlesRes,
          recentUsersRes,
          recentArticlesRes,
        ] = await Promise.all([
          adminDashboardService.getOverview(src.token),
          adminDashboardService.getUserGrowth(monthsBack, src.token),
          adminDashboardService.getTopUsers(5, src.token),
          adminDashboardService.getTopCategories(6, src.token),
          adminDashboardService.getTopArticles(5, src.token),
          adminDashboardService.getRecentUsers(4, src.token),
          adminDashboardService.getRecentArticles(4, src.token),
        ]);

        setData({
          counts: overview.counts ?? null,
          userGrowth: userGrowthRes.userGrowth ?? [],
          topUsers: topUsersRes.topUsers ?? [],
          topCategories: topCategoriesRes.topCategories ?? [],
          topArticles: topArticlesRes.topArticles ?? [],
          recentUsers: recentUsersRes.recentUsers ?? [],
          recentArticles: recentArticlesRes.recentArticles ?? [],
          overviewRecentUsers: overview.recentUsers ?? [],
        });
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error('Admin dashboard load failed', err);
        setError('Failed to load admin analytics. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  };

  useEffect(() => {
    load();

    return () => {
      cancelSourceRef.current?.cancel('Admin dashboard unmounted');
    };
  }, [monthsBack]);

  return { data, loading, error, reload: load };
}
