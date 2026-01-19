// Bundle size optimization utilities
// These help with tree-shaking and dynamic imports

// Modular date-fns imports - only import what you need
export const dateUtils = {
  format: async (date: Date | number, formatStr: string) => {
    const { format } = await import('date-fns/format');
    return format(date, formatStr);
  },
  formatDistanceToNow: async (date: Date | number) => {
    const { formatDistanceToNow } = await import('date-fns/formatDistanceToNow');
    return formatDistanceToNow(date);
  },
  isToday: async (date: Date) => {
    const { isToday } = await import('date-fns/isToday');
    return isToday(date);
  },
  addDays: async (date: Date, amount: number) => {
    const { addDays } = await import('date-fns/addDays');
    return addDays(date, amount);
  },
  startOfWeek: async (date: Date) => {
    const { startOfWeek } = await import('date-fns/startOfWeek');
    return startOfWeek(date);
  },
  endOfWeek: async (date: Date) => {
    const { endOfWeek } = await import('date-fns/endOfWeek');
    return endOfWeek(date);
  },
};

// Lazy Recharts loading
export const lazyCharts = {
  LineChart: () => import('recharts').then((m) => ({ default: m.LineChart })),
  AreaChart: () => import('recharts').then((m) => ({ default: m.AreaChart })),
  BarChart: () => import('recharts').then((m) => ({ default: m.BarChart })),
  PieChart: () => import('recharts').then((m) => ({ default: m.PieChart })),
  RadarChart: () => import('recharts').then((m) => ({ default: m.RadarChart })),
  ComposedChart: () => import('recharts').then((m) => ({ default: m.ComposedChart })),
};

// Chart components lazy loading
export async function getChartComponents() {
  const recharts = await import('recharts');
  return {
    ResponsiveContainer: recharts.ResponsiveContainer,
    LineChart: recharts.LineChart,
    Line: recharts.Line,
    AreaChart: recharts.AreaChart,
    Area: recharts.Area,
    BarChart: recharts.BarChart,
    Bar: recharts.Bar,
    XAxis: recharts.XAxis,
    YAxis: recharts.YAxis,
    CartesianGrid: recharts.CartesianGrid,
    Tooltip: recharts.Tooltip,
    Legend: recharts.Legend,
    PieChart: recharts.PieChart,
    Pie: recharts.Pie,
    Cell: recharts.Cell,
  };
}

// Lazy Three.js loading
export async function getThreeComponents() {
  const [
    { Canvas },
    { OrbitControls, PerspectiveCamera, Environment, Float, MeshDistortMaterial },
    THREE,
  ] = await Promise.all([
    import('@react-three/fiber'),
    import('@react-three/drei'),
    import('three'),
  ]);

  return {
    Canvas,
    OrbitControls,
    PerspectiveCamera,
    Environment,
    Float,
    MeshDistortMaterial,
    THREE,
  };
}

// Critical path optimization - preload essential chunks
export function preloadCriticalChunks() {
  // Core UI components should be loaded immediately
  const criticalImports = [
    () => import('@/components/ui/button'),
    () => import('@/components/ui/card'),
    () => import('@/components/ui/dialog'),
  ];

  // Use link preload for critical chunks
  if (typeof document !== 'undefined') {
    criticalImports.forEach((importFn) => {
      importFn().catch(() => {}); // Preload silently
    });
  }
}

// Analyze and report bundle usage
export function reportBundleUsage() {
  if (process.env.NODE_ENV !== 'production') {
    const loadedModules = new Set<string>();

    // Track what gets loaded
    const originalImport = (window as any).__vite_import__ || ((path: string) => import(path));
    (window as any).__vite_import__ = (path: string) => {
      loadedModules.add(path);
      return originalImport(path);
    };

    // Report after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        console.group('📦 Bundle Usage Report');
        console.log(`Loaded modules: ${loadedModules.size}`);
        console.log('Modules:', Array.from(loadedModules));
        console.groupEnd();
      }, 5000);
    });
  }
}

// Code splitting hints for Vite
export const splitPoints = {
  // Heavy features that should be separate chunks
  admin: () => import('@/pages/admin/AdminDashboardPage'),
  academy: () => import('@/pages/Academy'),
  bioOS: () => import('@/pages/BioOS'),
  warRoom: () => import('@/components/WarRoom'),
  charts: () => import('recharts'),
  three: () => import('@react-three/fiber'),
};

// Utility to create chunk names for better debugging
export function namedChunk<T>(name: string, importFn: () => Promise<T>): () => Promise<T> {
  return () => importFn();
}

// Memory cleanup utilities
export function cleanupMemory() {
  // Clear image cache
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        if (name.includes('image-cache')) {
          caches.delete(name);
        }
      });
    });
  }

  // Hint to garbage collector (no-op in most browsers, but signals intent)
  if ((window as any).gc) {
    (window as any).gc();
  }
}

// Performance mark utilities for debugging
export function measureChunkLoad(chunkName: string, loadFn: () => Promise<any>) {
  return async () => {
    const startMark = `${chunkName}-load-start`;
    const endMark = `${chunkName}-load-end`;
    const measureName = `${chunkName}-load-time`;

    performance.mark(startMark);
    try {
      const result = await loadFn();
      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);

      if (process.env.NODE_ENV !== 'production') {
        const measure = performance.getEntriesByName(measureName)[0];
        console.log(`📦 ${chunkName} loaded in ${measure?.duration?.toFixed(2)}ms`);
      }

      return result;
    } catch (error) {
      performance.mark(endMark);
      throw error;
    }
  };
}
