import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

interface LoadingContextType {
  globalLoading: LoadingState;
  setGlobalLoading: (loading: boolean, message?: string) => void;
  setProgress: (progress: number) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [globalLoading, setLoadingState] = useState<LoadingState>({
    isLoading: false,
  });

  const setGlobalLoading = useCallback((loading: boolean, message?: string) => {
    setLoadingState({ isLoading: loading, message, progress: undefined });
  }, []);

  const setProgress = useCallback((progress: number) => {
    setLoadingState((prev) => ({ ...prev, progress }));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    // Integrate with sonner toast
    const { toast } = require('sonner');
    toast[type === 'info' ? 'message' : type](message);
  }, []);

  return (
    <LoadingContext.Provider value={{ globalLoading, setGlobalLoading, setProgress, showToast }}>
      {children}
      
      {/* Global Loading Overlay */}
      <AnimatePresence>
        {globalLoading.isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/30"
            >
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                {globalLoading.progress !== undefined && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {Math.round(globalLoading.progress)}%
                    </span>
                  </div>
                )}
              </div>
              {globalLoading.message && (
                <p className="text-sm text-muted-foreground animate-pulse">
                  {globalLoading.message}
                </p>
              )}
              {globalLoading.progress !== undefined && (
                <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary/60"
                    initial={{ width: 0 }}
                    animate={{ width: `${globalLoading.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
};
