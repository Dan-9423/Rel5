import { useState, useCallback } from 'react';
import { queryCache } from '@/lib/cache/queryCache';

interface MutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: Error, variables: TVariables) => void | Promise<void>;
  onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables) => void | Promise<void>;
  invalidateQueries?: string[];
}

interface MutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  data: TData | undefined;
  reset: () => void;
}

export function useMutation<TData, TVariables>({
  mutationFn,
  onSuccess,
  onError,
  onSettled,
  invalidateQueries = [],
}: MutationOptions<TData, TVariables>): MutationResult<TData, TVariables> {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TData | undefined>(undefined);

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsError(false);
    setError(null);
    setData(undefined);
  }, []);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const result = await mutationFn(variables);
        setData(result);
        await onSuccess?.(result, variables);

        // Invalidate affected queries
        invalidateQueries.forEach(queryKey => {
          queryCache.invalidateQuery(queryKey);
        });

        await onSettled?.(result, null, variables);
        return result;
      } catch (err) {
        setIsError(true);
        const error = err as Error;
        setError(error);
        await onError?.(error, variables);
        await onSettled?.(undefined, error, variables);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, onSuccess, onError, onSettled, invalidateQueries]
  );

  return {
    mutate,
    isLoading,
    isError,
    error,
    data,
    reset,
  };
}