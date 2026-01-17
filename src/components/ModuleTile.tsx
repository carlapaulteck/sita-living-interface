import { GlassCard } from "./GlassCard";
import { LucideIcon } from "lucide-react";

interface ModuleTileProps {
  title: string;
  icon: LucideIcon;
  delay?: number;
  variant?: "default" | "gold" | "purple";
}

export function ModuleTile({ title, icon: Icon, delay = 0, variant = "default" }: ModuleTileProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "gold":
        return "from-primary/30 to-primary/10 border-primary/30 group-hover:border-primary/50";
      case "purple":
        return "from-secondary/30 to-secondary/10 border-secondary/30 group-hover:border-secondary/50";
      default:
        return "from-primary/20 to-primary/5 border-primary/20 group-hover:border-primary/40";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "purple": return "text-secondary";
      default: return "text-primary";
    }
  };

  return (
    <GlassCard 
      className="p-4 flex flex-col items-center justify-center gap-3 aspect-square cursor-pointer group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`p-3 rounded-xl bg-gradient-to-br ${getVariantClasses()} border transition-colors duration-300`}>
        <Icon className={`h-6 w-6 ${getIconColor()}`} />
      </div>
      <span className="text-sm font-medium text-foreground text-center">
        {title}
      </span>
    </GlassCard>
  );
}
