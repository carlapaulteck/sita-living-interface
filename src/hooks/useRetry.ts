import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  onRetry?: (attempt: number, error: Error) => void;
  retryCondition?: (error: Error) => boolean;
}

interface RetryState {
  isRetrying: boolean;
  attempt: number;
  lastError: Error | null;
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffFactor: 2,
  onRetry: () => {},
  retryCondition: () => true,
};

export function useRetry<T>(
  asyncFn: () => Promise<T>,
  options: RetryOptions = {}
) {
  const [state, setState] = useState<RetryState>({
    isRetrying: false,
    attempt: 0,
    lastError: null,
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const mergedOptions = { ...defaultOptions, ...options };

  const calculateDelay = useCallback((attempt: number): number => {
    const delay = mergedOptions.initialDelay * Math.pow(mergedOptions.backoffFactor, attempt);
    // Add jitter (±20%)
    const jitter = delay * 0.2 * (Math.random() - 0.5);
    return Math.min(delay + jitter, mergedOptions.maxDelay);
  }, [mergedOptions.initialDelay, mergedOptions.backoffFactor, mergedOptions.maxDelay]);

  const execute = useCallback(async (): Promise<T> => {
    setState({ isRetrying: false, attempt: 0, lastError: null });
    abortControllerRef.current = new AbortController();

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= mergedOptions.maxRetries; attempt++) {
      try {
        const result = await asyncFn();
        setState({ isRetrying: false, attempt: 0, lastError: null });
        return result;
      } catch (error) {
        lastError = error as Error;
        
        // Check if we should retry
        if (
          attempt >= mergedOptions.maxRetries ||
          !mergedOptions.retryCondition(lastError) ||
          abortControllerRef.current?.signal.aborted
        ) {
          break;
        }

        // Update state for retry
        setState({
          isRetrying: true,
          attempt: attempt + 1,
          lastError,
        });

        // Notify about retry
        mergedOptions.onRetry(attempt + 1, lastError);
        
        const delay = calculateDelay(attempt);
        toast.info(`Retrying... (${attempt + 1}/${mergedOptions.maxRetries})`, {
          description: `Next attempt in ${Math.round(delay / 1000)}s`,
          duration: delay,
        });

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    setState({ isRetrying: false, attempt: 0, lastError });
    throw lastError;
  }, [asyncFn, calculateDelay, mergedOptions]);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setState({ isRetrying: false, attempt: 0, lastError: null });
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    execute,
    cancel,
    ...state,
  };
}

// Higher-order function for wrapping async operations with retry
export function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: RetryOptions = {}
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const mergedOptions = { ...defaultOptions, ...options };
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= mergedOptions.maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error as Error;
        
        if (
          attempt >= mergedOptions.maxRetries ||
          !mergedOptions.retryCondition(lastError)
        ) {
          break;
        }

        const delay = mergedOptions.initialDelay * Math.pow(mergedOptions.backoffFactor, attempt);
        await new Promise((resolve) => setTimeout(resolve, Math.min(delay, mergedOptions.maxDelay)));
      }
    }

    throw lastError;
  };
}

// Network-aware retry condition
export const isNetworkError = (error: Error): boolean => {
  const networkErrorMessages = [
    'network',
    'fetch',
    'timeout',
    'connection',
    'offline',
    'ECONNREFUSED',
    'ENOTFOUND',
    'ETIMEDOUT',
  ];
  
  const message = error.message.toLowerCase();
  return networkErrorMessages.some((msg) => message.includes(msg));
};

// Rate limit aware retry condition  
export const isRateLimitError = (error: Error): boolean => {
  const message = error.message.toLowerCase();
  return message.includes('429') || message.includes('rate limit') || message.includes('too many requests');
};
