import { GlassCard } from "./GlassCard";
import { DollarSign, Menu, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoImage from "@/assets/logo.jpg";

export function Header() {
  const navigate = useNavigate();
  
  return (
    <header className="animate-fade-in-up">
      <GlassCard className="px-4 sm:px-6 py-3 flex items-center justify-between" hover={false}>
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-primary/30 bg-gradient-to-br from-secondary/20 to-primary/20">
            <img 
              src={logoImage} 
              alt="Alpha Vision Method" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-display font-semibold tracking-wide bg-gradient-to-b from-secondary via-primary/80 to-primary bg-clip-text text-transparent">
              Alpha Vision
            </span>
            <span className="text-sm text-muted-foreground ml-2">
              The Living Interface
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </button>
          <button 
            onClick={() => navigate("/settings")}
            className="p-2.5 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
          <button className="p-2.5 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </GlassCard>
    </header>
  );
}
