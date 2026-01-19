import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface AutoSaveOptions {
  key: string;
  debounceMs?: number;
  maxAge?: number; // Max age in ms before draft expires
  onRestore?: (data: any) => void;
}

interface AutoSaveState {
  hasDraft: boolean;
  lastSaved: Date | null;
  isSaving: boolean;
}

export function useAutoSave<T extends Record<string, any>>(
  data: T,
  options: AutoSaveOptions
) {
  const { key, debounceMs = 1000, maxAge = 1000 * 60 * 60 * 24 } = options; // 24h default
  const [state, setState] = useState<AutoSaveState>({
    hasDraft: false,
    lastSaved: null,
    isSaving: false,
  });
  
  const timeoutRef = useRef<NodeJS.Timeout>();
  const initialCheckDone = useRef(false);

  // Check for existing draft on mount
  useEffect(() => {
    if (initialCheckDone.current) return;
    initialCheckDone.current = true;

    try {
      const stored = localStorage.getItem(`draft_${key}`);
      if (stored) {
        const { data: savedData, timestamp } = JSON.parse(stored);
        const age = Date.now() - timestamp;
        
        if (age < maxAge) {
          setState((prev) => ({ ...prev, hasDraft: true, lastSaved: new Date(timestamp) }));
          
          // Show restore prompt
          toast.info('Draft found!', {
            description: 'Would you like to restore your previous work?',
            action: {
              label: 'Restore',
              onClick: () => {
                options.onRestore?.(savedData);
                toast.success('Draft restored');
              },
            },
            duration: 10000,
          });
        } else {
          // Draft expired, clean up
          localStorage.removeItem(`draft_${key}`);
        }
      }
    } catch (error) {
      console.error('Error checking for draft:', error);
    }
  }, [key, maxAge, options]);

  // Debounced save
  useEffect(() => {
    // Don't save if data is empty
    const hasContent = Object.values(data).some((val) => 
      val !== '' && val !== null && val !== undefined && 
      (typeof val !== 'object' || Object.keys(val).length > 0)
    );
    
    if (!hasContent) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState((prev) => ({ ...prev, isSaving: true }));

    timeoutRef.current = setTimeout(() => {
      try {
        const payload = {
          data,
          timestamp: Date.now(),
        };
        localStorage.setItem(`draft_${key}`, JSON.stringify(payload));
        setState({
          hasDraft: true,
          lastSaved: new Date(),
          isSaving: false,
        });
      } catch (error) {
        console.error('Error saving draft:', error);
        setState((prev) => ({ ...prev, isSaving: false }));
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, key, debounceMs]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(`draft_${key}`);
    setState({ hasDraft: false, lastSaved: null, isSaving: false });
  }, [key]);

  const restoreDraft = useCallback((): T | null => {
    try {
      const stored = localStorage.getItem(`draft_${key}`);
      if (stored) {
        const { data: savedData } = JSON.parse(stored);
        return savedData;
      }
    } catch (error) {
      console.error('Error restoring draft:', error);
    }
    return null;
  }, [key]);

  return {
    ...state,
    clearDraft,
    restoreDraft,
  };
}

// Hook for remembering user preferences
export function usePreference<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(`pref_${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setPreference = useCallback((newValue: T) => {
    setValue(newValue);
    try {
      localStorage.setItem(`pref_${key}`, JSON.stringify(newValue));
    } catch (error) {
      console.error('Error saving preference:', error);
    }
  }, [key]);

  return [value, setPreference];
}

// Hook for remembering last visited route/tab
export function useLastVisited(scope: string) {
  const key = `lastVisited_${scope}`;
  
  const getLastVisited = useCallback((): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);

  const setLastVisited = useCallback((path: string) => {
    try {
      localStorage.setItem(key, path);
    } catch (error) {
      console.error('Error saving last visited:', error);
    }
  }, [key]);

  return { getLastVisited, setLastVisited };
}
