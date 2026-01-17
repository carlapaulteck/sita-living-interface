import { motion } from "framer-motion";

interface VoiceWaveformProps {
  isActive: boolean;
}

export function VoiceWaveform({ isActive }: VoiceWaveformProps) {
  const bars = 12;

  return (
    <div className="flex items-center gap-0.5 h-6">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-primary rounded-full"
          initial={{ height: 4 }}
          animate={
            isActive
              ? {
                  height: [4, Math.random() * 20 + 4, 4],
                }
              : { height: 4 }
          }
          transition={{
            duration: 0.3,
            repeat: isActive ? Infinity : 0,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
