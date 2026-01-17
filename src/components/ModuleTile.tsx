import { GlassCard } from "./GlassCard";
import { LucideIcon } from "lucide-react";

interface ModuleTileProps {
  title: string;
  icon: LucideIcon;
  delay?: number;
}

export function ModuleTile({ title, icon: Icon, delay = 0 }: ModuleTileProps) {
  return (
    <GlassCard 
      className="p-4 flex flex-col items-center justify-center gap-3 aspect-square cursor-pointer group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 group-hover:border-primary/40 transition-colors duration-300">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <span className="text-sm font-medium text-foreground text-center">
        {title}
      </span>
    </GlassCard>
  );
}
