import { useState, useEffect, useCallback } from 'react';
import { queryCache } from '@/lib/cache/queryCache';

interface QueryOptions<T> {
  queryKey: string;
  queryFn: () => Promise<T>;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retry?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface QueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useQuery<T>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 0,
  retry = 3,
  onSuccess,
  onError,
}: QueryOptions<T>): QueryResult<T> {
  const [data, setData] = useState<T | undefined>(() => queryCache.getQueryData(queryKey));
  const [isLoading, setIsLoading] = useState(!data);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    let attempts = 0;
    while (attempts < retry) {
      try {
        const result = await queryFn();
        queryCache.setQueryData(queryKey, result);
        setData(result);
        onSuccess?.(result);
        return;
      } catch (err) {
        attempts++;
        if (attempts === retry) {
          setIsError(true);
          setError(err as Error);
          onError?.(err as Error);
        }
      }
    }
    setIsLoading(false);
  }, [queryKey, queryFn, retry, onSuccess, onError]);

  useEffect(() => {
    if (!enabled) return;

    const cachedData = queryCache.getQueryData(queryKey);
    if (cachedData && Date.now() - cachedData.timestamp < staleTime) {
      setData(cachedData.data);
      return;
    }

    fetchData();

    const unsubscribe = queryCache.subscribe(queryKey, () => {
      setData(queryCache.getQueryData(queryKey));
    });

    return () => {
      unsubscribe();
    };
  }, [queryKey, enabled, staleTime, fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}