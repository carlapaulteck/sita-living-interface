import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { MessageCircle, X, Mic, MicOff, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import avatarImage from '@/assets/avatar.jpg';

interface PiPAvatarProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  hasNotification?: boolean;
  onToggleMic?: () => void;
  onToggleMute?: () => void;
  onOpenChat?: () => void;
  className?: string;
}

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const cornerPositions = {
  'top-left': { x: 20, y: 20 },
  'top-right': { x: -20, y: 20 },
  'bottom-left': { x: 20, y: -20 },
  'bottom-right': { x: -20, y: -20 },
};

export function PictureInPictureAvatar({
  isListening = false,
  isSpeaking = false,
  hasNotification = false,
  onToggleMic,
  onToggleMute,
  onOpenChat,
  className,
}: PiPAvatarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [corner, setCorner] = useState<Corner>('bottom-right');
  const [isDragging, setIsDragging] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const getCornerStyle = () => {
    const base = { position: 'fixed' as const, zIndex: 60 };
    switch (corner) {
      case 'top-left':
        return { ...base, top: 20, left: 20 };
      case 'top-right':
        return { ...base, top: 20, right: 20 };
      case 'bottom-left':
        return { ...base, bottom: 100, left: 20 };
      case 'bottom-right':
      default:
        return { ...base, bottom: 100, right: 20 };
    }
  };

  const handleDragEnd = useCallback((event: any, info: any) => {
    setIsDragging(false);
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const x = info.point.x;
    const y = info.point.y;

    const isLeft = x < windowWidth / 2;
    const isTop = y < windowHeight / 2;

    if (isTop && isLeft) setCorner('top-left');
    else if (isTop && !isLeft) setCorner('top-right');
    else if (!isTop && isLeft) setCorner('bottom-left');
    else setCorner('bottom-right');
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    onToggleMute?.();
  };

  // Minimized dot view
  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className={cn(
          "fixed z-60 cursor-pointer",
          corner.includes('right') ? 'right-6' : 'left-6',
          corner.includes('bottom') ? 'bottom-24' : 'top-6'
        )}
        onClick={() => setIsMinimized(false)}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={cn(
            "w-4 h-4 rounded-full",
            "bg-gradient-to-br from-primary to-primary/50",
            hasNotification && "ring-2 ring-primary ring-offset-2 ring-offset-background"
          )}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      style={getCornerStyle()}
      onHoverStart={() => !isDragging && setIsExpanded(true)}
      onHoverEnd={() => !isDragging && setIsExpanded(false)}
      className={cn("cursor-grab active:cursor-grabbing", className)}
    >
      <motion.div
        animate={{
          width: isExpanded ? 200 : 64,
          height: isExpanded ? 'auto' : 64,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative overflow-hidden",
          "bg-card/95 backdrop-blur-xl",
          "border border-border/50 rounded-2xl",
          "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
        )}
      >
        {/* Avatar circle */}
        <div className="relative p-2">
          <motion.div
            className={cn(
              "relative w-12 h-12 rounded-full overflow-hidden",
              "ring-2 ring-offset-2 ring-offset-card",
              isListening ? "ring-accent" : isSpeaking ? "ring-primary" : "ring-border/50"
            )}
          >
            <img
              src={avatarImage}
              alt="SITA Avatar"
              className="w-full h-full object-cover"
            />
            
            {/* Speaking animation */}
            <AnimatePresence>
              {isSpeaking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-primary"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Notification badge */}
          {hasNotification && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                "absolute -top-1 -right-1 w-5 h-5",
                "bg-destructive rounded-full",
                "flex items-center justify-center",
                "text-[10px] font-bold text-destructive-foreground"
              )}
            >
              <Sparkles className="w-3 h-3" />
            </motion.div>
          )}

          {/* Listening indicator */}
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 0 0 hsl(var(--accent) / 0.4)',
                  '0 0 0 10px hsl(var(--accent) / 0)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </div>

        {/* Expanded controls */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 pb-3"
            >
              {/* Status text */}
              <div className="text-center mb-3">
                <p className="text-xs text-muted-foreground">
                  {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onToggleMic}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    isListening
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMute}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    "bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onOpenChat}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    "bg-primary/20 text-primary hover:bg-primary/30"
                  )}
                >
                  <MessageCircle className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMinimized(true)}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    "bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default PictureInPictureAvatar;
