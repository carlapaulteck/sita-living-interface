import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface NumberCountupProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  delay?: number;
}

export function NumberCountup({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  delay = 0,
}: NumberCountupProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });
  
  const display = useTransform(spring, (current) =>
    `${prefix}${current.toFixed(decimals)}${suffix}`
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setTimeout(() => {
            setHasStarted(true);
            spring.set(value);
          }, delay);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, delay, hasStarted, spring]);

  // Update when value changes
  useEffect(() => {
    if (hasStarted) {
      spring.set(value);
    }
  }, [value, hasStarted, spring]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}

// Compact number formatter (e.g., 1.2K, 3.5M)
export function CompactCountup({
  value,
  className = '',
  delay = 0,
}: {
  value: number;
  className?: string;
  delay?: number;
}) {
  const formatCompact = (num: number): { value: number; suffix: string; decimals: number } => {
    if (num >= 1000000) {
      return { value: num / 1000000, suffix: 'M', decimals: 1 };
    }
    if (num >= 1000) {
      return { value: num / 1000, suffix: 'K', decimals: 1 };
    }
    return { value: num, suffix: '', decimals: 0 };
  };

  const { value: displayValue, suffix, decimals } = formatCompact(value);

  return (
    <NumberCountup
      value={displayValue}
      suffix={suffix}
      decimals={decimals}
      className={className}
      delay={delay}
    />
  );
}
