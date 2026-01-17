import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Heart, Flower2, ArrowUp } from "lucide-react";

interface DockItem {
  id: string;
  path: string;
  icon: typeof Globe;
  label: string;
  sublabel: string;
}

const DOCK_ITEMS: DockItem[] = [
  { id: "wealth", path: "/business", icon: Globe, label: "Wealth", sublabel: "Portfolio & Growth" },
  { id: "life", path: "/life", icon: Heart, label: "Life & Health", sublabel: "Wellness & Balance" },
  { id: "mind", path: "/mind", icon: Flower2, label: "Mind & Growth", sublabel: "Focus & Learning" },
  { id: "sovereignty", path: "/sovereignty", icon: ArrowUp, label: "Sovereignty", sublabel: "Autonomy & Control" },
];

export function BottomDock() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === "/business") {
      return location.pathname === "/business" || location.pathname === "/";
    }
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      {/* Gradient fade above dock */}
      <div className="h-12 bg-gradient-to-t from-background/90 to-transparent" />
      
      {/* Main dock container */}
      <nav className="pointer-events-auto bg-background/80 backdrop-blur-xl border-t border-border/50 pb-safe">
        <div className="max-w-screen-xl mx-auto px-2 py-2">
          <div className="grid grid-cols-4 gap-2">
            {DOCK_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative flex flex-col items-center justify-center
                    min-h-[72px] rounded-xl p-3 touch-feedback
                    transition-all duration-300 ease-out overflow-hidden
                    ${active 
                      ? "dock-button-active" 
                      : "dock-button-inactive hover:dock-button-hover"
                    }
                  `}
                >
                  {/* Glass background */}
                  <div className={`
                    absolute inset-0 rounded-xl transition-all duration-300
                    ${active
                      ? "bg-gradient-to-b from-primary/20 to-primary/5 border border-primary/30"
                      : "bg-foreground/5 border border-foreground/10 hover:bg-foreground/8 hover:border-foreground/15"
                    }
                  `}>
                    {/* Inner glow for active */}
                    {active && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/10 to-transparent" />
                    )}
                  </div>

                  {/* Icon container with glow */}
                  <div className={`
                    relative z-10 rounded-lg p-2 mb-1 transition-all duration-300
                    ${active 
                      ? "text-primary" 
                      : "text-muted-foreground"
                    }
                  `}>
                    {/* Glow effect behind icon when active */}
                    {active && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 rounded-lg bg-primary/30 blur-lg"
                      />
                    )}
                    <Icon 
                      className={`
                        relative h-6 w-6 transition-all duration-300
                        ${active ? "drop-shadow-[0_0_8px_hsl(var(--brand-gold)/0.6)]" : ""}
                      `}
                      strokeWidth={active ? 2.5 : 2}
                    />
                  </div>

                  {/* Label */}
                  <span className={`
                    relative z-10 text-xs font-medium text-center leading-tight
                    transition-colors duration-300
                    ${active ? "text-foreground" : "text-muted-foreground"}
                  `}>
                    {item.label}
                  </span>

                  {/* Sublabel - hidden on very small screens */}
                  <span className={`
                    relative z-10 text-[10px] text-center leading-tight mt-0.5
                    hidden xs:block transition-colors duration-300
                    ${active ? "text-muted-foreground" : "text-muted-foreground/60"}
                  `}>
                    {item.sublabel}
                  </span>

                  {/* Active indicator line */}
                  {active && (
                    <motion.div
                      layoutId="dock-indicator"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Corner accent */}
                  {active && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary/60" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
