// src/hooks/useUserSettings.ts
import { useCallback, useEffect, useState } from "react";
import type { ArticlyUser } from "../types/user.types";
import { getCurrentUser } from "../services/user.service";
import { ApiClientError } from "../lib/apiClientError";
import type { ApiErrorResponse } from "../types/api.types";

interface UseUserSettingsResult {
  user: ArticlyUser | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
  setUser: (user: ArticlyUser) => void;
}

export function useUserSettings(): UseUserSettingsResult {
  const [user, setUser] = useState<ArticlyUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const reload = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const me = await getCurrentUser();
        if (isMounted) {
          setUser(me);
        }
      } catch (err: any) {
        let msg = "Failed to load profile";
        if (err instanceof ApiClientError) {
          const data = err.data as ApiErrorResponse | undefined;
          msg = data?.message || err.message || msg;
        }
        if (isMounted) {
          setError(msg);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleSetUser = useCallback((u: ArticlyUser) => {
    setUser(u);
  }, []);

  return {
    user,
    loading,
    error,
    reload,
    setUser: handleSetUser,
  };
}
