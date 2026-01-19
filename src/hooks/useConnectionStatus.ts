import { useState, useEffect, useCallback, useRef } from 'react';

type ConnectionStatus = 'online' | 'offline' | 'slow';
type ConnectionType = 'wifi' | '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';

interface ConnectionInfo {
  status: ConnectionStatus;
  type: ConnectionType;
  downlink: number; // Mbps
  rtt: number; // Round-trip time in ms
  saveData: boolean;
  effectiveType: string;
}

interface QueuedMutation {
  id: string;
  operation: 'insert' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
}

const MUTATION_QUEUE_KEY = 'offline_mutation_queue';

export function useConnectionStatus(): ConnectionInfo {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>(() => ({
    status: typeof navigator !== 'undefined' && navigator.onLine ? 'online' : 'offline',
    type: 'unknown',
    downlink: 10,
    rtt: 50,
    saveData: false,
    effectiveType: '4g',
  }));

  useEffect(() => {
    const updateConnectionInfo = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

      let type: ConnectionType = 'unknown';
      let downlink = 10;
      let rtt = 50;
      let saveData = false;
      let effectiveType = '4g';

      if (connection) {
        effectiveType = connection.effectiveType || '4g';
        downlink = connection.downlink || 10;
        rtt = connection.rtt || 50;
        saveData = connection.saveData || false;

        switch (effectiveType) {
          case '4g':
            type = '4g';
            break;
          case '3g':
            type = '3g';
            break;
          case '2g':
            type = '2g';
            break;
          case 'slow-2g':
            type = 'slow-2g';
            break;
          default:
            type = connection.type === 'wifi' ? 'wifi' : 'unknown';
        }
      }

      const status: ConnectionStatus = !navigator.onLine
        ? 'offline'
        : downlink < 1 || rtt > 500
        ? 'slow'
        : 'online';

      setConnectionInfo({
        status,
        type,
        downlink,
        rtt,
        saveData,
        effectiveType,
      });
    };

    updateConnectionInfo();

    window.addEventListener('online', updateConnectionInfo);
    window.addEventListener('offline', updateConnectionInfo);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo);
    }

    return () => {
      window.removeEventListener('online', updateConnectionInfo);
      window.removeEventListener('offline', updateConnectionInfo);
      if (connection) {
        connection.removeEventListener('change', updateConnectionInfo);
      }
    };
  }, []);

  return connectionInfo;
}

// Offline mutation queue
export function useOfflineMutations() {
  const [queue, setQueue] = useState<QueuedMutation[]>(() => {
    try {
      const stored = localStorage.getItem(MUTATION_QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const connectionInfo = useConnectionStatus();
  const processingRef = useRef(false);

  // Save queue to localStorage
  useEffect(() => {
    localStorage.setItem(MUTATION_QUEUE_KEY, JSON.stringify(queue));
  }, [queue]);

  // Add mutation to queue
  const queueMutation = useCallback((mutation: Omit<QueuedMutation, 'id' | 'timestamp'>) => {
    const newMutation: QueuedMutation = {
      ...mutation,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
    };

    setQueue((prev) => [...prev, newMutation]);
    return newMutation.id;
  }, []);

  // Process queued mutations when online
  const processQueue = useCallback(
    async (processor: (mutation: QueuedMutation) => Promise<boolean>) => {
      if (processingRef.current || connectionInfo.status !== 'online' || queue.length === 0) {
        return;
      }

      processingRef.current = true;
      const failedMutations: QueuedMutation[] = [];

      for (const mutation of queue) {
        try {
          const success = await processor(mutation);
          if (!success) {
            failedMutations.push(mutation);
          }
        } catch (error) {
          console.error('Failed to process mutation:', error);
          failedMutations.push(mutation);
        }
      }

      setQueue(failedMutations);
      processingRef.current = false;
    },
    [connectionInfo.status, queue]
  );

  // Clear a specific mutation
  const removeMutation = useCallback((id: string) => {
    setQueue((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // Clear all mutations
  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    queue,
    queueLength: queue.length,
    queueMutation,
    processQueue,
    removeMutation,
    clearQueue,
    isOnline: connectionInfo.status === 'online',
  };
}

// Adaptive quality based on connection
export function useAdaptiveQuality() {
  const connectionInfo = useConnectionStatus();

  const getImageQuality = useCallback((): 'low' | 'medium' | 'high' => {
    if (connectionInfo.saveData || connectionInfo.status === 'slow') {
      return 'low';
    }
    if (connectionInfo.type === '4g' || connectionInfo.type === 'wifi') {
      return 'high';
    }
    if (connectionInfo.type === '3g') {
      return 'medium';
    }
    return 'low';
  }, [connectionInfo]);

  const shouldReduceAnimations = useCallback((): boolean => {
    return connectionInfo.status === 'slow' || connectionInfo.saveData || connectionInfo.type === '2g' || connectionInfo.type === 'slow-2g';
  }, [connectionInfo]);

  const shouldDeferNonCritical = useCallback((): boolean => {
    return connectionInfo.status !== 'online' || connectionInfo.rtt > 300;
  }, [connectionInfo]);

  const getVideoQuality = useCallback((): '360p' | '720p' | '1080p' => {
    if (connectionInfo.saveData || connectionInfo.downlink < 1) {
      return '360p';
    }
    if (connectionInfo.downlink < 5) {
      return '720p';
    }
    return '1080p';
  }, [connectionInfo]);

  return {
    connectionInfo,
    getImageQuality,
    shouldReduceAnimations,
    shouldDeferNonCritical,
    getVideoQuality,
  };
}

// Retry with exponential backoff
export function useRetryWithBackoff() {
  const retry = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      options: { maxRetries?: number; baseDelay?: number; maxDelay?: number } = {}
    ): Promise<T> => {
      const { maxRetries = 3, baseDelay = 1000, maxDelay = 30000 } = options;

      let lastError: Error | null = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          return await operation();
        } catch (error) {
          lastError = error as Error;
          if (attempt < maxRetries - 1) {
            const delay = Math.min(baseDelay * Math.pow(2, attempt) + Math.random() * 1000, maxDelay);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      throw lastError;
    },
    []
  );

  return { retry };
}
