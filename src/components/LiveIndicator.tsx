import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LiveIndicatorProps {
  isConnected: boolean;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LiveIndicator({ 
  isConnected, 
  showLabel = false, 
  size = "sm",
  className 
}: LiveIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  };

  const labelSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="relative">
        {/* Outer glow ring */}
        {isConnected && (
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full",
              isConnected ? "bg-emerald-500" : "bg-amber-500"
            )}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        
        {/* Main dot */}
        <motion.div
          className={cn(
            "relative rounded-full",
            sizeClasses[size],
            isConnected 
              ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
              : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
          )}
          animate={isConnected ? {
            scale: [1, 1.1, 1],
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      {showLabel && (
        <span className={cn(
          "font-medium uppercase tracking-wider",
          labelSizes[size],
          isConnected ? "text-emerald-500" : "text-amber-500"
        )}>
          {isConnected ? "Live" : "Connecting..."}
        </span>
      )}
    </div>
  );
}
