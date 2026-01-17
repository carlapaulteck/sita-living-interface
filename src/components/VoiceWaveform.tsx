import { motion } from "framer-motion";

interface VoiceWaveformProps {
  isActive: boolean;
  barCount?: number;
  className?: string;
}

export function VoiceWaveform({ isActive, barCount = 5, className = "" }: VoiceWaveformProps) {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div className={`flex items-center justify-center gap-0.5 h-5 ${className}`}>
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-0.5 bg-secondary rounded-full"
          initial={{ height: 4 }}
          animate={
            isActive
              ? {
                  height: [4, 16, 8, 20, 4],
                  transition: {
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.1,
                    ease: "easeInOut",
                  },
                }
              : { height: 4 }
          }
        />
      ))}
    </div>
  );
}
