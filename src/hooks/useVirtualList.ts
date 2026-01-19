import { useRef, useState, useEffect, useCallback, useMemo } from 'react';

interface UseVirtualListOptions<T> {
  items: T[];
  itemHeight: number;
  overscan?: number;
  containerHeight?: number;
}

interface VirtualItem<T> {
  index: number;
  item: T;
  style: React.CSSProperties;
}

export function useVirtualList<T>({
  items,
  itemHeight,
  overscan = 3,
  containerHeight = 400,
}: UseVirtualListOptions<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(containerHeight);

  // Update container height on resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setHeight(entry.contentRect.height);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Calculate visible items
  const { virtualItems, totalHeight, startIndex, endIndex } = useMemo(() => {
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(height / itemHeight);
    const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);

    const virtualItems: VirtualItem<T>[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      virtualItems.push({
        index: i,
        item: items[i],
        style: {
          position: 'absolute',
          top: i * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight,
        },
      });
    }

    return { virtualItems, totalHeight, startIndex, endIndex };
  }, [items, itemHeight, scrollTop, height, overscan]);

  return {
    containerRef,
    containerProps: {
      ref: containerRef,
      onScroll: handleScroll,
      style: {
        height: containerHeight,
        overflow: 'auto',
        position: 'relative' as const,
      },
    },
    innerProps: {
      style: {
        height: totalHeight,
        position: 'relative' as const,
      },
    },
    virtualItems,
    scrollToIndex: (index: number) => {
      containerRef.current?.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth',
      });
    },
    isScrolling: false,
    startIndex,
    endIndex,
  };
}

// Infinite scroll hook
interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
}

export function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 0.8,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, threshold]);

  return { loadMoreRef };
}

// Request batching utility
type BatchedRequest<T> = {
  key: string;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
};

export function createRequestBatcher<T>(
  batchFn: (keys: string[]) => Promise<Map<string, T>>,
  delay = 10
) {
  let batch: BatchedRequest<T>[] = [];
  let timeoutId: NodeJS.Timeout | null = null;

  const executeBatch = async () => {
    const currentBatch = batch;
    batch = [];
    timeoutId = null;

    try {
      const keys = currentBatch.map((req) => req.key);
      const results = await batchFn(keys);
      
      currentBatch.forEach((req) => {
        const result = results.get(req.key);
        if (result !== undefined) {
          req.resolve(result);
        } else {
          req.reject(new Error(`No result for key: ${req.key}`));
        }
      });
    } catch (error) {
      currentBatch.forEach((req) => {
        req.reject(error instanceof Error ? error : new Error(String(error)));
      });
    }
  };

  return (key: string): Promise<T> => {
    return new Promise((resolve, reject) => {
      batch.push({ key, resolve, reject });

      if (!timeoutId) {
        timeoutId = setTimeout(executeBatch, delay);
      }
    });
  };
}

// Request deduplication
const inFlightRequests = new Map<string, Promise<unknown>>();

export function deduplicateRequest<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const existing = inFlightRequests.get(key);
  if (existing) {
    return existing as Promise<T>;
  }

  const request = fetcher().finally(() => {
    inFlightRequests.delete(key);
  });

  inFlightRequests.set(key, request);
  return request;
}
