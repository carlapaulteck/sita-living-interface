import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'gold' | 'purple' | 'cyan';
  animate?: boolean;
}

export function LuxurySkeleton({
  className,
  variant = 'default',
  animate = true,
}: SkeletonProps) {
  const gradientColors = {
    default: 'from-muted via-muted-foreground/10 to-muted',
    gold: 'from-muted via-primary/20 to-muted',
    purple: 'from-muted via-secondary/20 to-muted',
    cyan: 'from-muted via-accent/20 to-muted',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-muted/50',
        className
      )}
    >
      {animate && (
        <motion.div
          className={cn(
            'absolute inset-0',
            'bg-gradient-to-r',
            gradientColors[variant]
          )}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: `linear-gradient(90deg, transparent, hsl(var(--${variant === 'default' ? 'muted-foreground' : variant === 'gold' ? 'primary' : variant === 'purple' ? 'secondary' : 'accent'}) / 0.1), transparent)`,
          }}
        />
      )}
    </div>
  );
}

// Card skeleton with branded shimmer
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl',
        'bg-card/50 border border-border/30',
        'p-6 space-y-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <LuxurySkeleton className="w-12 h-12 rounded-full" variant="gold" />
        <div className="flex-1 space-y-2">
          <LuxurySkeleton className="h-4 w-2/3 rounded" />
          <LuxurySkeleton className="h-3 w-1/3 rounded" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <LuxurySkeleton className="h-4 w-full rounded" />
        <LuxurySkeleton className="h-4 w-5/6 rounded" />
        <LuxurySkeleton className="h-4 w-4/6 rounded" />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <LuxurySkeleton className="h-10 w-24 rounded-lg" variant="purple" />
        <LuxurySkeleton className="h-10 w-24 rounded-lg" />
      </div>

      {/* Premium shimmer overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'linear-gradient(135deg, transparent 0%, transparent 40%, hsl(var(--primary) / 0.03) 50%, transparent 60%, transparent 100%)',
            'linear-gradient(135deg, transparent 0%, transparent 40%, hsl(var(--primary) / 0.08) 50%, transparent 60%, transparent 100%)',
            'linear-gradient(135deg, transparent 0%, transparent 40%, hsl(var(--primary) / 0.03) 50%, transparent 60%, transparent 100%)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

// Metric skeleton
export function MetricSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl',
        'bg-card/50 border border-border/30',
        'p-4',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <LuxurySkeleton className="h-3 w-16 rounded" />
          <LuxurySkeleton className="h-8 w-24 rounded" variant="gold" />
          <LuxurySkeleton className="h-3 w-20 rounded" />
        </div>
        <LuxurySkeleton className="w-16 h-16 rounded-full" variant="cyan" />
      </div>
    </div>
  );
}

// List skeleton
export function ListSkeleton({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={cn(
            'flex items-center gap-4 p-4',
            'bg-card/30 border border-border/20 rounded-lg'
          )}
        >
          <LuxurySkeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <LuxurySkeleton className="h-4 w-3/4 rounded" />
            <LuxurySkeleton className="h-3 w-1/2 rounded" />
          </div>
          <LuxurySkeleton className="h-6 w-16 rounded-full" variant="gold" />
        </motion.div>
      ))}
    </div>
  );
}

// Chart skeleton
export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl',
        'bg-card/50 border border-border/30',
        'p-6',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <LuxurySkeleton className="h-5 w-32 rounded" />
        <div className="flex gap-2">
          <LuxurySkeleton className="h-8 w-16 rounded-lg" />
          <LuxurySkeleton className="h-8 w-16 rounded-lg" />
        </div>
      </div>

      {/* Chart area */}
      <div className="relative h-48 flex items-end gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${30 + Math.random() * 70}%` }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            className="flex-1"
          >
            <LuxurySkeleton className="h-full rounded-t" variant={i % 3 === 0 ? 'gold' : 'default'} />
          </motion.div>
        ))}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <LuxurySkeleton key={i} className="h-3 w-8 rounded" />
        ))}
      </div>
    </div>
  );
}

// Full page skeleton
export function PageSkeleton() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <LuxurySkeleton className="h-8 w-48 rounded" variant="gold" />
          <LuxurySkeleton className="h-4 w-64 rounded" />
        </div>
        <div className="flex gap-4">
          <LuxurySkeleton className="h-10 w-10 rounded-full" />
          <LuxurySkeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <CardSkeleton />
      </div>

      {/* List */}
      <ListSkeleton count={3} />
    </div>
  );
}

export default LuxurySkeleton;
