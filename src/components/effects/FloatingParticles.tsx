import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  hue: number;
}

interface FloatingParticlesProps {
  count?: number;
  interactive?: boolean;
  className?: string;
}

export function FloatingParticles({ 
  count = 30, 
  interactive = true,
  className = '' 
}: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize particles
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      opacity: 0.1 + Math.random() * 0.3,
      speed: 0.02 + Math.random() * 0.05,
      hue: Math.random() > 0.5 ? 40 : 265, // Gold or purple
    }));
    setParticles(newParticles);
  }, [count]);

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  // Animation loop
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      setParticles((prev) =>
        prev.map((particle) => {
          let newY = particle.y - particle.speed;
          if (newY < -5) newY = 105;

          // Interactive repulsion from mouse
          if (interactive) {
            const dx = particle.x - mousePos.x;
            const dy = particle.y - mousePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 15) {
              const force = (15 - distance) / 15;
              return {
                ...particle,
                x: particle.x + (dx / distance) * force * 0.5,
                y: newY + (dy / distance) * force * 0.5,
              };
            }
          }

          return { ...particle, y: newY };
        })
      );
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [interactive, mousePos]);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `hsl(${particle.hue} 70% 60% / ${particle.opacity})`,
            boxShadow: `0 0 ${particle.size * 2}px hsl(${particle.hue} 70% 60% / ${particle.opacity * 0.5})`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Lighter version with fewer particles for performance
export function AmbientGlow({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Large ambient orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, hsl(var(--brand-gold)), transparent 70%)',
          left: '10%',
          top: '20%',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, hsl(var(--brand-purple)), transparent 70%)',
          right: '15%',
          bottom: '30%',
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full opacity-5"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent-cyan)), transparent 70%)',
          left: '50%',
          top: '60%',
        }}
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
