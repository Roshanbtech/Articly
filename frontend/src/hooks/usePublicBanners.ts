// src/hooks/usePublicBanners.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Banner } from '../types/banner.types';
import { listActiveBanners } from '../services/banner.service';
import { createCancelTokenSource } from '../config/apiClient';

interface UsePublicBannersResult {
  banners: Banner[];
  loading: boolean;
  error: string | null;
}

export function usePublicBanners(): UsePublicBannersResult {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const src = createCancelTokenSource();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await listActiveBanners(src.token);
        setBanners(res.banners);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error('Failed to load public banners', err);
        setError('Failed to load banners.');
      } finally {
        setLoading(false);
      }
    })();

    return () => src.cancel('usePublicBanners unmounted');
  }, []);

  return { banners, loading, error };
}
