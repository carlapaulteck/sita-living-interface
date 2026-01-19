import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 3000);
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={`fixed top-0 left-0 right-0 z-[9998] flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium ${
            isOnline 
              ? 'bg-green-500/90 text-white' 
              : 'bg-destructive/90 text-destructive-foreground'
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4" />
              <span>Back online! Syncing your data...</span>
              <RefreshCw className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <span>You're offline. Changes will sync when you reconnect.</span>
            </>
          )}
        </motion.div>
      )}
      
      {/* Persistent offline indicator */}
      {!isOnline && !showBanner && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-20 right-4 z-[9997] p-2 rounded-full bg-destructive/90 text-destructive-foreground shadow-lg"
          title="You're offline"
        >
          <WifiOff className="h-4 w-4" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
