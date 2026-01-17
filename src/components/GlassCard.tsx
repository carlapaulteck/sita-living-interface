import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type GlowVariant = "none" | "gold" | "purple" | "cyan" | "brand";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: React.ReactNode;
  className?: string;
  glow?: GlowVariant;
  hover?: boolean;
  premium?: boolean;
}

const glowClasses: Record<GlowVariant, string> = {
  none: "",
  gold: "hover:shadow-[0_0_40px_rgba(255,215,0,0.2),0_0_80px_rgba(184,134,11,0.1)]",
  purple: "hover:shadow-[0_0_40px_rgba(147,112,219,0.25),0_0_80px_rgba(147,112,219,0.1)]",
  cyan: "hover:shadow-[0_0_40px_rgba(0,255,255,0.2),0_0_80px_rgba(0,139,139,0.1)]",
  brand: "hover:shadow-[0_0_40px_rgba(147,112,219,0.2),0_0_60px_rgba(255,215,0,0.15)]",
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, glow = "none", hover = true, premium = false, ...props }, ref) => {
    if (premium) {
      return (
        <motion.div
          ref={ref}
          className={cn(
            "relative rounded-2xl group overflow-hidden",
            "bg-gradient-to-br from-white/[0.08] to-white/[0.02]",
            "backdrop-blur-2xl",
            hover && "cursor-pointer",
            className
          )}
          whileHover={hover ? { scale: 1.01, y: -2 } : undefined}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          {...props}
        >
          {/* Gradient border */}
          <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-br from-white/20 via-white/5 to-white/10 pointer-events-none">
            <div className="absolute inset-[1px] rounded-2xl bg-[#0a0a0f]" />
          </div>
          
          {/* Inner top highlight */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          {/* Corner glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#FFD700]/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none" />
          
          {/* Noise texture */}
          <div 
            className="absolute inset-0 opacity-[0.015] pointer-events-none rounded-2xl"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
          
          <div className="relative z-10 p-6">
            {children}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl",
          "bg-gradient-to-br from-white/[0.05] to-white/[0.02]",
          "backdrop-blur-2xl",
          "border border-white/[0.08]",
          "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_60px_rgba(0,0,0,0.5)]",
          "transition-all duration-500",
          hover && [
            "hover:bg-gradient-to-br hover:from-white/[0.08] hover:to-white/[0.03]",
            "hover:border-white/[0.15]",
            "hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_25px_70px_rgba(0,0,0,0.6)]",
            "cursor-pointer",
          ],
          glowClasses[glow],
          "group",
          className
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        whileHover={hover ? { scale: 1.005, y: -2 } : undefined}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        {...props}
      >
        {/* Inner top highlight */}
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Corner glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#FFD700]/15 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 p-6">
          {children}
        </div>
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
