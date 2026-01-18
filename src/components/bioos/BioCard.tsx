import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BioCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function BioCard({
  children,
  className,
  gradient,
  hover = true,
  glow = false,
  onClick
}: BioCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-white/5 backdrop-blur-xl',
        'border border-white/10',
        hover && 'cursor-pointer transition-all duration-300 hover:border-white/20',
        glow && 'shadow-lg',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Gradient overlay */}
      {gradient && (
        <div
          className={cn(
            'absolute inset-0 opacity-10 bg-gradient-to-br',
            gradient
          )}
        />
      )}

      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Inner highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </motion.div>
  );
}

// Hero Card variant for main sections
export function BioHeroCard({
  children,
  className,
  mode
}: {
  children: React.ReactNode;
  className?: string;
  mode?: 'BUILD' | 'RECOVER' | 'CUT' | 'FOCUS';
}) {
  const modeGradients: Record<string, string> = {
    BUILD: 'from-amber-500/20 via-orange-600/10 to-transparent',
    RECOVER: 'from-cyan-500/20 via-blue-600/10 to-transparent',
    CUT: 'from-purple-500/20 via-pink-600/10 to-transparent',
    FOCUS: 'from-emerald-500/20 via-green-600/10 to-transparent'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-3xl',
        'bg-gradient-to-br from-white/10 to-white/5',
        'backdrop-blur-2xl',
        'border border-white/10',
        className
      )}
    >
      {/* Animated gradient background */}
      {mode && (
        <motion.div
          className={cn(
            'absolute inset-0 bg-gradient-to-br',
            modeGradients[mode]
          )}
          animate={{
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}

      {/* Particle effect overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            initial={{
              x: Math.random() * 100 + '%',
              y: '100%',
              opacity: 0
            }}
            animate={{
              y: '-20%',
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeOut'
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </motion.div>
  );
}
