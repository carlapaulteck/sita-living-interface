import { lazy, ComponentType, LazyExoticComponent, useEffect, useState, useRef, useCallback } from 'react';

// Dynamic import cache for better performance
const importCache = new Map<string, Promise<{ default: ComponentType<any> }>>();
const loadedComponents = new Set<string>();

// Lazy load with preload capability
export function lazyWithPreload<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  cacheKey: string
): LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> } {
  const preload = (): Promise<{ default: T }> => {
    if (importCache.has(cacheKey)) {
      return importCache.get(cacheKey)! as Promise<{ default: T }>;
    }
    const promise = factory();
    importCache.set(cacheKey, promise as Promise<{ default: ComponentType<any> }>);
    promise.then(() => loadedComponents.add(cacheKey));
    return promise;
  };

  const Component = lazy(preload) as LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> };
  Component.preload = preload;

  return Component;
}

// Check if a component is already loaded
export function isComponentLoaded(cacheKey: string): boolean {
  return loadedComponents.has(cacheKey);
}

// Preload multiple components at once
export function preloadComponents(
  components: Array<{ key: string; factory: () => Promise<{ default: ComponentType<any> }> }>
): Promise<void[]> {
  return Promise.all(
    components.map(({ key, factory }) => {
      if (importCache.has(key)) {
        return importCache.get(key)!.then(() => {});
      }
      const promise = factory();
      importCache.set(key, promise);
      return promise.then(() => {
        loadedComponents.add(key);
      });
    })
  );
}

// Lazy load heavy libraries only when needed
type LibraryLoader<T> = () => Promise<T>;

const libraryCache = new Map<string, any>();

export function useLazyLibrary<T>(
  cacheKey: string,
  loader: LibraryLoader<T>,
  options: { preload?: boolean } = {}
): { library: T | null; isLoading: boolean; error: Error | null } {
  const [library, setLibrary] = useState<T | null>(() => libraryCache.get(cacheKey) || null);
  const [isLoading, setIsLoading] = useState(!libraryCache.has(cacheKey));
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (libraryCache.has(cacheKey)) {
      setLibrary(libraryCache.get(cacheKey));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    loader()
      .then((lib) => {
        libraryCache.set(cacheKey, lib);
        if (mountedRef.current) {
          setLibrary(lib);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (mountedRef.current) {
          setError(err);
          setIsLoading(false);
        }
      });
  }, [cacheKey, loader]);

  return { library, isLoading, error };
}

// Lazy load Recharts only when needed
export function useLazyRecharts() {
  return useLazyLibrary('recharts', async () => {
    const recharts = await import('recharts');
    return recharts;
  });
}

// Lazy load Three.js/React Three Fiber only when needed
export function useLazyThree() {
  return useLazyLibrary('three-fiber', async () => {
    const [three, fiber, drei] = await Promise.all([
      import('three'),
      import('@react-three/fiber'),
      import('@react-three/drei'),
    ]);
    return { three, fiber, drei };
  });
}

// Lazy load Framer Motion only when needed (for pages that don't need animations)
export function useLazyFramerMotion() {
  return useLazyLibrary('framer-motion', async () => {
    const motion = await import('framer-motion');
    return motion;
  });
}

// Intersection-based lazy loading hook
export function useIntersectionLazy<T>(
  loader: () => Promise<T>,
  options: IntersectionObserverInit = {}
): {
  ref: (node: HTMLElement | null) => void;
  data: T | null;
  isLoading: boolean;
} {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadedRef = useRef(false);

  const ref = useCallback((node: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!node || loadedRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadedRef.current) {
          loadedRef.current = true;
          setIsLoading(true);
          loader()
            .then(setData)
            .finally(() => setIsLoading(false));
          observerRef.current?.disconnect();
        }
      },
      { rootMargin: '100px', ...options }
    );

    observerRef.current.observe(node);
  }, [loader, options]);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return { ref, data, isLoading };
}

// Tree-shakeable icon loader
const iconCache = new Map<string, ComponentType<any>>();

export function useLazyIcon(iconName: string): ComponentType<any> | null {
  const [Icon, setIcon] = useState<ComponentType<any> | null>(() => iconCache.get(iconName) || null);

  useEffect(() => {
    if (iconCache.has(iconName)) {
      setIcon(iconCache.get(iconName)!);
      return;
    }

    // Dynamic import for tree-shaking
    import('lucide-react')
      .then((module: any) => {
        const IconComponent = module[iconName];
        if (IconComponent) {
          iconCache.set(iconName, IconComponent);
          setIcon(() => IconComponent);
        }
      })
      .catch(console.error);
  }, [iconName]);

  return Icon;
}
