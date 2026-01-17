import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface ModuleTileProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  path?: string;
  status?: "active" | "pending" | "inactive";
  stats?: { label: string; value: string }[];
  accentColor?: "gold" | "purple" | "cyan" | "emerald";
  variant?: "default" | "gold" | "purple";
  className?: string;
  delay?: number;
  onClick?: () => void;
}

const accentStyles = {
  gold: {
    bg: "from-[#FFD700]/20 via-[#B8860B]/10 to-transparent",
    border: "group-hover:border-[#FFD700]/40",
    icon: "bg-gradient-to-br from-[#FFD700]/20 to-[#B8860B]/10 text-[#FFD700]",
    glow: "group-hover:shadow-[0_0_60px_rgba(255,215,0,0.25)]",
    text: "text-[#FFD700]",
  },
  purple: {
    bg: "from-[#9370DB]/20 via-[#9370DB]/10 to-transparent",
    border: "group-hover:border-[#9370DB]/40",
    icon: "bg-gradient-to-br from-[#9370DB]/20 to-[#9370DB]/10 text-[#9370DB]",
    glow: "group-hover:shadow-[0_0_60px_rgba(147,112,219,0.25)]",
    text: "text-[#9370DB]",
  },
  cyan: {
    bg: "from-[#00FFFF]/20 via-[#008B8B]/10 to-transparent",
    border: "group-hover:border-[#00FFFF]/40",
    icon: "bg-gradient-to-br from-[#00FFFF]/20 to-[#008B8B]/10 text-[#00FFFF]",
    glow: "group-hover:shadow-[0_0_60px_rgba(0,255,255,0.25)]",
    text: "text-[#00FFFF]",
  },
  emerald: {
    bg: "from-emerald-500/20 via-emerald-600/10 to-transparent",
    border: "group-hover:border-emerald-500/40",
    icon: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-400",
    glow: "group-hover:shadow-[0_0_60px_rgba(16,185,129,0.25)]",
    text: "text-emerald-400",
  },
};

const statusDot = {
  active: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]",
  pending: "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]",
  inactive: "bg-muted-foreground/50",
};

export function ModuleTile({
  title,
  description,
  icon: Icon,
  path,
  status = "active",
  stats,
  accentColor,
  variant = "default",
  className,
  delay = 0,
  onClick,
}: ModuleTileProps) {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Map variant to accentColor for backward compatibility
  const resolvedAccentColor = accentColor || (variant === "purple" ? "purple" : "gold");
  const accent = accentStyles[resolvedAccentColor];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      navigate(path);
    }
  };

  // Simple tile for backward compatibility (no description)
  if (!description) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
        onClick={handleClick}
        className={cn(
          "relative overflow-hidden rounded-2xl p-4 cursor-pointer group aspect-square",
          "bg-gradient-to-br from-white/[0.05] to-white/[0.02]",
          "backdrop-blur-2xl",
          "border border-white/[0.08]",
          "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_60px_rgba(0,0,0,0.5)]",
          "transition-all duration-500",
          "flex flex-col items-center justify-center gap-3",
          accent.border,
          accent.glow,
          className
        )}
        whileHover={{ scale: 1.02, y: -4 }}
      >
        {/* Top highlight */}
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Background gradient on hover */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none",
          accent.bg
        )} />
        
        <div className={cn(
          "p-3 rounded-xl border border-white/10 transition-all duration-500 group-hover:scale-110 relative z-10",
          accent.icon
        )}>
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <span className="text-sm font-medium text-foreground text-center relative z-10">
          {title}
        </span>
      </motion.div>
    );
  }

  // Full tile with description and stats
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-2xl cursor-pointer group",
        "bg-gradient-to-br from-white/[0.05] to-white/[0.02]",
        "backdrop-blur-2xl",
        "border border-white/[0.08]",
        "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_60px_rgba(0,0,0,0.5)]",
        "transition-all duration-500",
        accent.border,
        accent.glow,
        className
      )}
      style={{
        transform: `perspective(1000px) rotateX(${-mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      whileHover={{ scale: 1.02, y: -6 }}
    >
      {/* Top highlight */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Background gradient on hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none",
        accent.bg
      )} />
      
      {/* Corner glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#FFD700]/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500",
            "border border-white/10",
            accent.icon,
            "group-hover:scale-110 group-hover:border-white/20"
          )}>
            <Icon className="w-7 h-7" strokeWidth={1.5} />
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status dot */}
            <div className={cn("w-3 h-3 rounded-full", statusDot[status])} />
            
            {/* Arrow */}
            <motion.div
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <ChevronRight className="w-4 h-4 text-foreground/70" />
            </motion.div>
          </div>
        </div>
        
        {/* Title & Description */}
        <h3 className="text-xl font-semibold text-foreground mb-2 font-['Playfair_Display'] tracking-wide">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          {description}
        </p>
        
        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="flex items-center gap-6 pt-5 border-t border-white/[0.06]">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className={cn("text-xl font-bold", accent.text)}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
