import { useQuery, useQueryClient, QueryKey, UseQueryOptions } from '@tanstack/react-query';
import { useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Request deduplication cache
const inflightRequests = new Map<string, Promise<any>>();

// Deduplicate identical in-flight requests
export function deduplicateRequest<T>(
  key: string,
  request: () => Promise<T>
): Promise<T> {
  const existing = inflightRequests.get(key);
  if (existing) return existing;

  const promise = request().finally(() => {
    inflightRequests.delete(key);
  });

  inflightRequests.set(key, promise);
  return promise;
}

// Request batching for multiple small API calls
interface BatchedRequest<T> {
  key: string;
  resolve: (value: T) => void;
  reject: (error: any) => void;
}

export function createRequestBatcher<TInput, TOutput>(
  batchFn: (inputs: TInput[]) => Promise<Map<TInput, TOutput>>,
  options: { maxBatchSize?: number; delayMs?: number } = {}
) {
  const { maxBatchSize = 25, delayMs = 10 } = options;
  let batch: { input: TInput; resolve: (v: TOutput | undefined) => void; reject: (e: any) => void }[] = [];
  let timeoutId: NodeJS.Timeout | null = null;

  const processBatch = async () => {
    const currentBatch = batch.slice(0, maxBatchSize);
    batch = batch.slice(maxBatchSize);

    if (currentBatch.length === 0) return;

    try {
      const inputs = currentBatch.map((b) => b.input);
      const results = await batchFn(inputs);
      currentBatch.forEach(({ input, resolve }) => {
        resolve(results.get(input));
      });
    } catch (error) {
      currentBatch.forEach(({ reject }) => reject(error));
    }

    if (batch.length > 0) {
      timeoutId = setTimeout(processBatch, delayMs);
    } else {
      timeoutId = null;
    }
  };

  return (input: TInput): Promise<TOutput | undefined> => {
    return new Promise((resolve, reject) => {
      batch.push({ input, resolve, reject });

      if (!timeoutId) {
        timeoutId = setTimeout(processBatch, delayMs);
      }
    });
  };
}

// Lean query builder - only select needed fields
interface LeanQueryOptions {
  table: string;
  select: string;
  filters?: Record<string, any>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  single?: boolean;
}

export async function leanQuery<T>({
  table,
  select,
  filters = {},
  order,
  limit,
  single = false,
}: LeanQueryOptions): Promise<{ data: T | null; error: any }> {
  let query = (supabase.from(table) as any).select(select);

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        query = query.in(key, value);
      } else if (typeof value === 'object' && value.operator) {
        switch (value.operator) {
          case 'gte':
            query = query.gte(key, value.value);
            break;
          case 'lte':
            query = query.lte(key, value.value);
            break;
          case 'gt':
            query = query.gt(key, value.value);
            break;
          case 'lt':
            query = query.lt(key, value.value);
            break;
          case 'neq':
            query = query.neq(key, value.value);
            break;
          case 'like':
            query = query.like(key, value.value);
            break;
          case 'ilike':
            query = query.ilike(key, value.value);
            break;
        }
      } else {
        query = query.eq(key, value);
      }
    }
  });

  // Apply ordering
  if (order) {
    query = query.order(order.column, { ascending: order.ascending ?? true });
  }

  // Apply limit
  if (limit) {
    query = query.limit(limit);
  }

  // Execute
  if (single) {
    return query.single();
  }

  return query;
}

// Optimized query hook with lean selects and caching
export function useOptimizedQuery<T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error, T, QueryKey>, 'queryKey' | 'queryFn'>
) {
  const queryClient = useQueryClient();
  const cacheKeyRef = useRef(JSON.stringify(queryKey));

  // Deduplicate the query function
  const deduplicatedFn = useCallback(() => {
    return deduplicateRequest(cacheKeyRef.current, queryFn);
  }, [queryFn]);

  return useQuery({
    queryKey,
    queryFn: deduplicatedFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache time
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    ...options,
  });
}

// Cursor-based pagination hook
interface CursorPaginationOptions<T> {
  queryKey: QueryKey;
  queryFn: (cursor: string | null, limit: number) => Promise<{ data: T[]; nextCursor: string | null }>;
  limit?: number;
}

export function useCursorPagination<T>({
  queryKey,
  queryFn,
  limit = 20,
}: CursorPaginationOptions<T>) {
  const queryClient = useQueryClient();
  const cursorRef = useRef<string | null>(null);
  const allDataRef = useRef<T[]>([]);

  const query = useQuery({
    queryKey: [...queryKey, cursorRef.current],
    queryFn: () => queryFn(cursorRef.current, limit),
    staleTime: 5 * 60 * 1000,
  });

  const loadMore = useCallback(() => {
    if (query.data?.nextCursor) {
      cursorRef.current = query.data.nextCursor;
      queryClient.invalidateQueries({ queryKey });
    }
  }, [query.data, queryClient, queryKey]);

  const hasMore = !!query.data?.nextCursor;

  // Accumulate data
  if (query.data?.data) {
    const existingIds = new Set(allDataRef.current.map((item: any) => item.id));
    const newItems = query.data.data.filter((item: any) => !existingIds.has(item.id));
    if (newItems.length > 0) {
      allDataRef.current = [...allDataRef.current, ...newItems];
    }
  }

  return {
    data: allDataRef.current,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    loadMore,
    hasMore,
    reset: useCallback(() => {
      cursorRef.current = null;
      allDataRef.current = [];
      queryClient.invalidateQueries({ queryKey });
    }, [queryClient, queryKey]),
  };
}

// Prefetch related data based on patterns
export function usePredictivePrefetch() {
  const queryClient = useQueryClient();

  const prefetchRelated = useCallback(
    async (patterns: Record<string, () => Promise<any>>) => {
      // Use requestIdleCallback for non-blocking prefetch
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(
          () => {
            Object.entries(patterns).forEach(([key, fetcher]) => {
              queryClient.prefetchQuery({
                queryKey: [key],
                queryFn: fetcher,
                staleTime: 5 * 60 * 1000,
              });
            });
          },
          { timeout: 2000 }
        );
      } else {
        setTimeout(() => {
          Object.entries(patterns).forEach(([key, fetcher]) => {
            queryClient.prefetchQuery({
              queryKey: [key],
              queryFn: fetcher,
              staleTime: 5 * 60 * 1000,
            });
          });
        }, 100);
      }
    },
    [queryClient]
  );

  return { prefetchRelated };
}

// Query result memoization with smart diffing
export function useStableQueryResult<T>(data: T | undefined): T | undefined {
  const prevRef = useRef<T | undefined>(data);

  return useMemo(() => {
    if (data === undefined) return prevRef.current;

    // Deep equality check for arrays/objects
    if (JSON.stringify(data) === JSON.stringify(prevRef.current)) {
      return prevRef.current;
    }

    prevRef.current = data;
    return data;
  }, [data]);
}
