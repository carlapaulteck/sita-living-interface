import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: "gold" | "cyan" | "none";
}

export function GlassCard({ 
  className, 
  children, 
  hover = true,
  glow = "none",
  ...props 
}: GlassCardProps) {
  return (
    <div
      {...props}
      className={cn(
        "glass-card",
        hover && "hover-lift hover-gold-rim",
        glow === "gold" && "glow-gold",
        glow === "cyan" && "glow-cyan",
        className
      )}
    >
      {children}
    </div>
  );
}
