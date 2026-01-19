import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Gift, Zap, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsNewModalProps {
  version?: string;
  features: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  }[];
  onDismiss: () => void;
}

export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({
  version = '2.0',
  features,
  onDismiss,
}) => {
  const [currentFeature, setCurrentFeature] = useState(0);

  const handleNext = () => {
    if (currentFeature < features.length - 1) {
      setCurrentFeature(currentFeature + 1);
    } else {
      onDismiss();
    }
  };

  const handlePrevious = () => {
    if (currentFeature > 0) {
      setCurrentFeature(currentFeature - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/90 backdrop-blur-xl z-[200] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg"
      >
        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute -top-12 right-0 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Card */}
        <div className="glass-card border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 px-6 py-8 text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4"
            >
              <Sparkles className="w-4 h-4" />
              <span>What's New in v{version}</span>
            </motion.div>
            
            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold"
            >
              New Features & Improvements
            </motion.h2>
          </div>

          {/* Feature content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="text-center py-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  {features[currentFeature].icon || <Star className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {features[currentFeature].title}
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  {features[currentFeature].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentFeature
                      ? 'bg-primary w-6'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentFeature === 0}
                className="opacity-50 disabled:opacity-20"
              >
                Previous
              </Button>
              
              <Button onClick={handleNext} className="gap-2">
                {currentFeature < features.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Get Started
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Hook to manage What's New modal visibility
export function useWhatsNew(currentVersion: string) {
  const [showModal, setShowModal] = useState(false);
  const storageKey = 'sita_whats_new_seen';

  useEffect(() => {
    const seenVersion = localStorage.getItem(storageKey);
    if (seenVersion !== currentVersion) {
      // Delay showing modal to not interrupt initial load
      const timer = setTimeout(() => setShowModal(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentVersion]);

  const dismiss = () => {
    setShowModal(false);
    localStorage.setItem(storageKey, currentVersion);
  };

  return { showModal, dismiss };
}
