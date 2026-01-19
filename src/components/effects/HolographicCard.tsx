import { ReactNode, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'gold' | 'purple' | 'cyan' | 'rainbow';
}

export function HolographicCard({ 
  children, 
  className = '',
  glowColor = 'gold',
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  
  // Holographic gradient position
  const gradientX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const gradientY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const glowColors = {
    gold: 'hsl(var(--brand-gold))',
    purple: 'hsl(var(--brand-purple))',
    cyan: 'hsl(var(--accent-cyan))',
    rainbow: 'transparent',
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative glass-card overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Holographic rainbow sheen overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 opacity-0"
          style={{
            background: useTransform(
              [gradientX, gradientY],
              ([x, y]) => `
                linear-gradient(
                  ${105 + (y as number) * 0.5}deg,
                  transparent 0%,
                  rgba(255, 0, 128, 0.1) ${20 + (x as number) * 0.3}%,
                  rgba(0, 255, 255, 0.1) ${40 + (x as number) * 0.3}%,
                  rgba(255, 255, 0, 0.1) ${60 + (x as number) * 0.3}%,
                  rgba(128, 0, 255, 0.1) ${80 + (x as number) * 0.3}%,
                  transparent 100%
                )
              `
            ),
            opacity: isHovered ? 0.6 : 0,
          }}
          animate={{ opacity: isHovered ? 0.6 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Prismatic light refraction */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: useTransform(
              [gradientX, gradientY],
              ([x, y]) => `
                radial-gradient(
                  circle at ${x}% ${y}%,
                  ${glowColors[glowColor]} 0%,
                  transparent 50%
                )
              `
            ),
            opacity: isHovered ? 0.15 : 0,
            mixBlendMode: 'overlay',
          }}
        />
        
        {/* Inner content with slight depth */}
        <motion.div
          style={{
            translateZ: isHovered ? 20 : 0,
          }}
        >
          {children}
        </motion.div>
        
        {/* Edge highlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, transparent 100%)',
            opacity: isHovered ? 1 : 0.5,
          }}
        />
      </motion.div>
      
      {/* Glow shadow underneath */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-[inherit]"
        style={{
          background: glowColors[glowColor],
          filter: 'blur(40px)',
          opacity: isHovered ? 0.3 : 0.1,
          transform: 'translateY(10px) scale(0.9)',
        }}
        animate={{
          opacity: isHovered ? 0.3 : 0.1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

// Simpler holographic shimmer for smaller elements
export function HolographicBadge({ 
  children,
  className = '',
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`relative inline-flex items-center overflow-hidden ${className}`}
      whileHover={{ scale: 1.05 }}
    >
      {/* Animated gradient border */}
      <motion.div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background: 'linear-gradient(90deg, hsl(var(--brand-gold)), hsl(var(--brand-purple)), hsl(var(--accent-cyan)), hsl(var(--brand-gold)))',
          backgroundSize: '300% 100%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Inner content */}
      <div className="relative m-[1px] rounded-[inherit] bg-card px-3 py-1">
        {children}
      </div>
    </motion.div>
  );
}
