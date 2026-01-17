import { GlassCard } from "./GlassCard";
import { DollarSign, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="animate-fade-in-up">
      <GlassCard className="px-6 py-4 flex items-center justify-between" hover={false}>
        <div className="flex items-center gap-2">
          <span className="text-lg font-display font-semibold tracking-wide text-foreground">
            SITA
          </span>
          <span className="text-primary text-sm">•</span>
          <span className="text-sm text-muted-foreground">
            The Living Interface
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl border border-foreground/10 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-xl border border-foreground/10 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </GlassCard>
    </header>
  );
}
