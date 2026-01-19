import { useEffect, useCallback, useRef, useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  sizes?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  placeholderSrc,
  sizes = '100vw',
  priority = false,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      {/* Blur placeholder */}
      {placeholderSrc && !isLoaded && (
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-lg scale-105"
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
    </div>
  );
}

// Responsive image with srcset support
interface ResponsiveImageProps {
  src: string;
  alt: string;
  widths?: number[];
  className?: string;
}

export function ResponsiveImage({
  src,
  alt,
  widths = [400, 800, 1200],
  className = '',
}: ResponsiveImageProps) {
  // Generate srcset from widths (assumes image service that supports width params)
  const srcSet = widths.map((w) => `${src}?w=${w} ${w}w`).join(', ');
  const sizes = widths.map((w, i) => {
    if (i === widths.length - 1) return `${w}px`;
    return `(max-width: ${w}px) ${w}px`;
  }).join(', ');

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}

// Preload critical assets
export function useAssetPreload() {
  const preloadedAssets = useRef<Set<string>>(new Set());

  const preloadImage = useCallback((src: string) => {
    if (preloadedAssets.current.has(src)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
    
    preloadedAssets.current.add(src);
  }, []);

  const preloadFont = useCallback((href: string) => {
    if (preloadedAssets.current.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = href;
    document.head.appendChild(link);
    
    preloadedAssets.current.add(href);
  }, []);

  const preloadScript = useCallback((src: string) => {
    if (preloadedAssets.current.has(src)) return;

    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = src;
    document.head.appendChild(link);
    
    preloadedAssets.current.add(src);
  }, []);

  return { preloadImage, preloadFont, preloadScript };
}

// Debounced render for rapid updates
export function useDebouncedRender<T>(value: T, delay = 100): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    const timeoutId = setTimeout(() => {
      rafRef.current = requestAnimationFrame(() => {
        setDebouncedValue(value);
      });
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

// Batch multiple state updates
export function useBatchedUpdates<T>(initialValue: T, batchWindow = 16) {
  const [value, setValue] = useState(initialValue);
  const pendingUpdates = useRef<((prev: T) => T)[]>([]);
  const rafRef = useRef<number>();

  const batchUpdate = useCallback((updater: (prev: T) => T) => {
    pendingUpdates.current.push(updater);

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        setTimeout(() => {
          setValue((prev) => {
            let result = prev;
            for (const update of pendingUpdates.current) {
              result = update(result);
            }
            pendingUpdates.current = [];
            rafRef.current = undefined;
            return result;
          });
        }, batchWindow);
      });
    }
  }, [batchWindow]);

  return [value, batchUpdate] as const;
}

// Request deduplication
const inflightRequests = new Map<string, Promise<any>>();

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

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(performance.now());

  useEffect(() => {
    renderCountRef.current++;
    const now = performance.now();
    const timeSinceLastRender = now - lastRenderTimeRef.current;
    lastRenderTimeRef.current = now;

    if (process.env.NODE_ENV !== 'production' && renderCountRef.current > 10) {
      console.warn(`⚠️ ${componentName} has rendered ${renderCountRef.current} times. Last render: ${timeSinceLastRender.toFixed(2)}ms ago`);
    }
  });

  return {
    renderCount: renderCountRef.current,
  };
}

// Measure component mount time
export function useMountTimer(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const mountDuration = performance.now() - startTime;
      if (process.env.NODE_ENV !== 'production' && mountDuration > 100) {
        console.log(`📊 ${componentName} was mounted for ${mountDuration.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
}
