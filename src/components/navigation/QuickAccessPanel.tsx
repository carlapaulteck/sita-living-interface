import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronUp, 
  Wallet, 
  Users, 
  Home, 
  Heart, 
  Brain, 
  Shield, 
  Bot,
  TrendingUp,
  Calendar,
  Target,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QuickLink {
  id: string;
  label: string;
  icon: typeof Wallet;
  path: string;
  category: "business" | "finance" | "health" | "mindset" | "community" | "assistant";
}

const QUICK_LINKS: QuickLink[] = [
  { id: "business", label: "Business OS", icon: TrendingUp, path: "/business", category: "business" },
  { id: "assistant", label: "Personal VA", icon: Bot, path: "/assistant", category: "assistant" },
  { id: "finance", label: "Finance", icon: Wallet, path: "/finance", category: "finance" },
  { id: "health", label: "Health", icon: Heart, path: "/health", category: "health" },
  { id: "mindset", label: "Mindset", icon: Brain, path: "/mindset", category: "mindset" },
  { id: "community", label: "Community", icon: Users, path: "/academy", category: "community" },
  { id: "family", label: "Family", icon: Home, path: "/family", category: "health" },
  { id: "calendar", label: "Calendar", icon: Calendar, path: "/health", category: "health" },
  { id: "goals", label: "Goals", icon: Target, path: "/mindset", category: "mindset" },
  { id: "sovereignty", label: "Privacy", icon: Shield, path: "/sovereignty", category: "assistant" },
];

const CATEGORY_COLORS = {
  business: "from-primary/20 to-primary/5 border-primary/30 text-primary",
  finance: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400",
  health: "from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-400",
  mindset: "from-violet-500/20 to-violet-500/5 border-violet-500/30 text-violet-400",
  community: "from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400",
  assistant: "from-accent/20 to-accent/5 border-accent/30 text-accent",
};

export function QuickAccessPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (navigator.vibrate) navigator.vibrate(10);
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-28 left-1/2 -translate-x-1/2 z-40",
          "px-4 py-2 rounded-full",
          "bg-card/80 backdrop-blur-xl border border-border/50",
          "flex items-center gap-2 text-sm text-muted-foreground",
          "hover:text-foreground hover:border-primary/30 transition-all duration-300"
        )}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronUp className="h-4 w-4" />
        </motion.span>
        Quick Access
      </motion.button>

      {/* Panel overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-32 left-4 right-4 z-50 max-w-2xl mx-auto"
            >
              <div className="bg-card/95 backdrop-blur-2xl rounded-2xl border border-border/50 p-4 shadow-2xl">
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {QUICK_LINKS.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <motion.button
                        key={link.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => handleNavigation(link.path)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 p-3 rounded-xl",
                          "bg-gradient-to-b border transition-all duration-300",
                          "hover:scale-105 active:scale-95",
                          CATEGORY_COLORS[link.category]
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-medium text-foreground/80">{link.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
