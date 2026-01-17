import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface QuickStatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  delay?: number;
}

export function QuickStatCard({ 
  title, 
  value, 
  subtitle,
  icon: Icon,
  delay = 0
}: QuickStatCardProps) {
  return (
    <GlassCard 
      className="p-4 animate-fade-in-up cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          <span className="text-2xl font-semibold text-foreground">
            {value}
          </span>
          {subtitle && (
            <span className="text-xs text-muted-foreground">
              {subtitle}
            </span>
          )}
        </div>
        {Icon && (
          <div className="p-2 rounded-xl bg-foreground/5 border border-foreground/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
    </GlassCard>
  );
}
