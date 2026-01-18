import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BioMetricRingProps {
  value: number;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  showPulse?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { ring: 80, stroke: 6, text: 'text-lg', label: 'text-xs' },
  md: { ring: 120, stroke: 8, text: 'text-2xl', label: 'text-sm' },
  lg: { ring: 160, stroke: 10, text: 'text-3xl', label: 'text-base' },
  xl: { ring: 200, stroke: 12, text: 'text-4xl', label: 'text-lg' }
};

export function BioMetricRing({
  value,
  maxValue = 100,
  size = 'md',
  color = 'cyan',
  label,
  sublabel,
  icon,
  showPulse = false,
  className
}: BioMetricRingProps) {
  const config = sizeConfig[size];
  const radius = (config.ring - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / maxValue, 1);
  const strokeDashoffset = circumference * (1 - progress);

  const colorClasses: Record<string, { gradient: string; glow: string; text: string }> = {
    cyan: { gradient: 'url(#cyanGradient)', glow: 'drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]', text: 'text-cyan-400' },
    emerald: { gradient: 'url(#emeraldGradient)', glow: 'drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]', text: 'text-emerald-400' },
    amber: { gradient: 'url(#amberGradient)', glow: 'drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]', text: 'text-amber-400' },
    purple: { gradient: 'url(#purpleGradient)', glow: 'drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]', text: 'text-purple-400' },
    red: { gradient: 'url(#redGradient)', glow: 'drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]', text: 'text-red-400' },
    blue: { gradient: 'url(#blueGradient)', glow: 'drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]', text: 'text-blue-400' }
  };

  const colorConfig = colorClasses[color] || colorClasses.cyan;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width: config.ring, height: config.ring }}>
        {/* Pulse effect */}
        {showPulse && (
          <motion.div
            className={cn('absolute inset-0 rounded-full opacity-30', colorConfig.glow)}
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: `radial-gradient(circle, ${color === 'cyan' ? 'rgba(6,182,212,0.3)' : 
                color === 'emerald' ? 'rgba(16,185,129,0.3)' :
                color === 'amber' ? 'rgba(245,158,11,0.3)' :
                color === 'purple' ? 'rgba(168,85,247,0.3)' :
                color === 'red' ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)'} 0%, transparent 70%)`
            }}
          />
        )}

        <svg
          width={config.ring}
          height={config.ring}
          className={cn('transform -rotate-90', colorConfig.glow)}
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>

          {/* Background ring */}
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            className="text-white/10"
          />

          {/* Progress ring */}
          <motion.circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke={colorConfig.gradient}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && <div className={cn('mb-1', colorConfig.text)}>{icon}</div>}
          <motion.span
            className={cn('font-bold', config.text, colorConfig.text)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {Math.round(value)}
          </motion.span>
          {sublabel && (
            <span className={cn('text-muted-foreground', config.label)}>{sublabel}</span>
          )}
        </div>
      </div>

      <p className={cn('mt-2 font-medium text-foreground', config.label)}>{label}</p>
    </div>
  );
}
