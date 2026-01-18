import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface SpeechWaveformVisualizerProps {
  audioLevel: number;
  frequencyData?: Uint8Array | null;
  isActive: boolean;
  variant?: "bars" | "wave" | "circular" | "radial";
  colorScheme?: "primary" | "gradient" | "mood";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SpeechWaveformVisualizer({
  audioLevel,
  frequencyData,
  isActive,
  variant = "bars",
  colorScheme = "primary",
  size = "md",
  className = ""
}: SpeechWaveformVisualizerProps) {
  const [localBars, setLocalBars] = useState<number[]>(Array(32).fill(0));

  // Process frequency data into bar heights
  useEffect(() => {
    if (!isActive) {
      setLocalBars(Array(32).fill(0));
      return;
    }

    if (frequencyData && frequencyData.length > 0) {
      // Sample frequency data into bar heights
      const barCount = 32;
      const step = Math.floor(frequencyData.length / barCount);
      const newBars = Array(barCount).fill(0).map((_, i) => {
        const start = i * step;
        let sum = 0;
        for (let j = start; j < start + step && j < frequencyData.length; j++) {
          sum += frequencyData[j];
        }
        return (sum / step) / 255; // Normalize to 0-1
      });
      setLocalBars(newBars);
    } else {
      // Simulate based on audio level
      const newBars = Array(32).fill(0).map((_, i) => {
        const centerWeight = 1 - Math.abs(i - 16) / 16;
        const randomness = Math.random() * 0.3;
        return Math.min(1, (audioLevel * centerWeight + randomness) * (isActive ? 1 : 0));
      });
      setLocalBars(newBars);
    }
  }, [audioLevel, frequencyData, isActive]);

  const sizeConfig = {
    sm: { height: 24, barWidth: 2, gap: 1, circleSize: 60 },
    md: { height: 48, barWidth: 3, gap: 2, circleSize: 100 },
    lg: { height: 72, barWidth: 4, gap: 3, circleSize: 160 }
  };

  const config = sizeConfig[size];

  const getBarColor = (index: number, height: number) => {
    if (colorScheme === "gradient") {
      const hue = (index / 32) * 60 + 180; // Cyan to Gold gradient
      return `hsl(${hue}, 80%, ${50 + height * 20}%)`;
    }
    if (colorScheme === "mood") {
      const intensity = Math.min(1, height + 0.3);
      return `rgba(255, 215, 0, ${intensity})`;
    }
    return "hsl(var(--primary))";
  };

  if (variant === "bars") {
    return (
      <div className={`flex items-center justify-center gap-[${config.gap}px] ${className}`} style={{ height: config.height }}>
        {localBars.map((height, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: config.barWidth,
              backgroundColor: getBarColor(i, height),
            }}
            animate={{
              height: isActive ? Math.max(4, height * config.height) : 4,
              opacity: isActive ? 0.5 + height * 0.5 : 0.3
            }}
            transition={{ duration: 0.05, ease: "linear" }}
          />
        ))}
      </div>
    );
  }

  if (variant === "wave") {
    const pathData = useMemo(() => {
      const width = 200;
      const mid = config.height / 2;
      let d = `M 0 ${mid}`;
      localBars.forEach((h, i) => {
        const x = (i / localBars.length) * width;
        const y = mid + (h - 0.5) * config.height * 0.8;
        d += ` L ${x} ${y}`;
      });
      d += ` L ${width} ${mid}`;
      return d;
    }, [localBars, config.height]);

    return (
      <svg 
        viewBox={`0 0 200 ${config.height}`} 
        className={`${className}`}
        style={{ width: '100%', height: config.height }}
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--accent))" />
            <stop offset="50%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
        </defs>
        <motion.path
          d={pathData}
          fill="none"
          stroke={colorScheme === "gradient" ? "url(#waveGradient)" : "hsl(var(--primary))"}
          strokeWidth={2}
          strokeLinecap="round"
          animate={{ opacity: isActive ? 1 : 0.3 }}
        />
      </svg>
    );
  }

  if (variant === "circular") {
    return (
      <div className={`relative ${className}`} style={{ width: config.circleSize, height: config.circleSize }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <radialGradient id="circleGradient" cx="50%" cy="50%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            </radialGradient>
          </defs>
          {localBars.slice(0, 24).map((height, i) => {
            const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
            const innerRadius = 30;
            const barLength = 15 * height;
            const x1 = 50 + Math.cos(angle) * innerRadius;
            const y1 = 50 + Math.sin(angle) * innerRadius;
            const x2 = 50 + Math.cos(angle) * (innerRadius + barLength);
            const y2 = 50 + Math.sin(angle) * (innerRadius + barLength);
            
            return (
              <motion.line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={getBarColor(i, height)}
                strokeWidth={2}
                strokeLinecap="round"
                animate={{
                  opacity: isActive ? 0.5 + height * 0.5 : 0.2
                }}
                transition={{ duration: 0.05 }}
              />
            );
          })}
          <motion.circle
            cx="50"
            cy="50"
            r={25}
            fill="url(#circleGradient)"
            animate={{
              r: isActive ? 25 + audioLevel * 5 : 25,
              opacity: isActive ? 0.8 : 0.4
            }}
            transition={{ duration: 0.1 }}
          />
        </svg>
      </div>
    );
  }

  if (variant === "radial") {
    return (
      <div className={`relative ${className}`} style={{ width: config.circleSize, height: config.circleSize }}>
        {[0.6, 0.8, 1].map((scale, ringIndex) => (
          <motion.div
            key={ringIndex}
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: `hsla(var(--primary) / ${0.3 + ringIndex * 0.2})`,
            }}
            animate={{
              scale: isActive ? scale + audioLevel * 0.1 * (ringIndex + 1) : scale,
              opacity: isActive ? 0.3 + audioLevel * 0.5 : 0.2
            }}
            transition={{ duration: 0.15 }}
          />
        ))}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, hsla(var(--primary) / 0.3) 0%, transparent 70%)"
          }}
          animate={{
            scale: isActive ? 1 + audioLevel * 0.2 : 1,
            opacity: isActive ? audioLevel : 0.1
          }}
          transition={{ duration: 0.1 }}
        />
      </div>
    );
  }

  return null;
}
