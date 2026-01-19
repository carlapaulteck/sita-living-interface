import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Prefetch rules based on current route and context
const PREFETCH_MAP: Record<string, string[]> = {
  '/': ['/business-growth', '/finance', '/personal-assistant', '/settings'],
  '/business-growth': ['/finance', '/intelligence', '/automations'],
  '/finance': ['/business-growth', '/settings'],
  '/personal-assistant': ['/settings', '/automations'],
  '/academy': ['/agents', '/settings'],
  '/settings': ['/automations', '/personal-assistant'],
  '/agents': ['/automations', '/intelligence'],
};

// Time-based prefetch rules
const TIME_BASED_ROUTES: Record<string, string[]> = {
  morning: ['/personal-assistant', '/business-growth'], // 6-12
  afternoon: ['/finance', '/business-growth'], // 12-18
  evening: ['/academy', '/settings'], // 18-22
  night: ['/personal-assistant'], // 22-6
};

// Module chunk names for dynamic imports
const ROUTE_CHUNKS: Record<string, () => Promise<unknown>> = {
  '/business-growth': () => import('../pages/BusinessGrowth'),
  '/finance': () => import('../pages/Finance'),
  '/personal-assistant': () => import('../pages/PersonalAssistant'),
  '/settings': () => import('../pages/Settings'),
  '/academy': () => import('../pages/Academy'),
  '/agents': () => import('../pages/Agents'),
  '/automations': () => import('../pages/Automations'),
  '/intelligence': () => import('../pages/Intelligence'),
  '/bio-os': () => import('../pages/BioOS'),
  '/family': () => import('../pages/Family'),
  '/healthcare': () => import('../pages/Healthcare'),
  '/home-intelligence': () => import('../pages/HomeIntelligence'),
  '/sovereignty': () => import('../pages/Sovereignty'),
  '/mindset': () => import('../pages/Mindset'),
};

function getTimeOfDay(): keyof typeof TIME_BASED_ROUTES {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

export function useSmartPrefetch() {
  const location = useLocation();
  const prefetchedRoutes = useRef<Set<string>>(new Set());
  const hoverTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Prefetch a route's chunk
  const prefetchRoute = useCallback((route: string) => {
    if (prefetchedRoutes.current.has(route)) return;
    
    const loader = ROUTE_CHUNKS[route];
    if (loader) {
      prefetchedRoutes.current.add(route);
      // Use requestIdleCallback for non-blocking prefetch
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => loader(), { timeout: 2000 });
      } else {
        setTimeout(() => loader(), 100);
      }
    }
  }, []);

  // Prefetch on hover (with delay to avoid unnecessary loads)
  const prefetchOnHover = useCallback((route: string) => {
    if (prefetchedRoutes.current.has(route)) return;
    
    const timeout = setTimeout(() => {
      prefetchRoute(route);
    }, 150); // 150ms hover intent delay
    
    hoverTimeouts.current.set(route, timeout);
  }, [prefetchRoute]);

  // Cancel prefetch if hover ends quickly
  const cancelPrefetch = useCallback((route: string) => {
    const timeout = hoverTimeouts.current.get(route);
    if (timeout) {
      clearTimeout(timeout);
      hoverTimeouts.current.delete(route);
    }
  }, []);

  // Auto-prefetch based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const routesToPrefetch = PREFETCH_MAP[currentPath] || [];
    
    // Prefetch related routes after a short delay
    const timer = setTimeout(() => {
      routesToPrefetch.forEach((route) => {
        prefetchRoute(route);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname, prefetchRoute]);

  // Time-based prefetch on initial load
  useEffect(() => {
    const timeOfDay = getTimeOfDay();
    const timeBasedRoutes = TIME_BASED_ROUTES[timeOfDay];
    
    // Prefetch time-appropriate routes after main content loads
    const timer = setTimeout(() => {
      timeBasedRoutes.forEach((route) => {
        prefetchRoute(route);
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [prefetchRoute]);

  return {
    prefetchRoute,
    prefetchOnHover,
    cancelPrefetch,
    isPrefetched: (route: string) => prefetchedRoutes.current.has(route),
  };
}

// Hook for navigation links with prefetch on hover
export function usePrefetchLink(to: string) {
  const { prefetchOnHover, cancelPrefetch } = useSmartPrefetch();
  
  return {
    onMouseEnter: () => prefetchOnHover(to),
    onMouseLeave: () => cancelPrefetch(to),
    onFocus: () => prefetchOnHover(to),
    onBlur: () => cancelPrefetch(to),
  };
}
