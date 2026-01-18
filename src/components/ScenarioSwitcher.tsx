import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { 
  Wrench, 
  ShoppingCart, 
  Store as StoreIcon, 
  Layers,
  ChevronDown,
  Check,
  Sparkles
} from "lucide-react";
import { ScenarioType } from "@/lib/scenarioData";

interface ScenarioSwitcherProps {
  currentScenario: ScenarioType;
  onScenarioChange: (scenario: ScenarioType) => void;
}

const scenarios = [
  { 
    id: "service" as ScenarioType, 
    name: "Service Business", 
    example: "Northside Roofing",
    icon: Wrench,
    description: "Home services, consulting, agencies",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-cyan-400"
  },
  { 
    id: "ecom" as ScenarioType, 
    name: "E-commerce", 
    example: "AURORA Skin",
    icon: ShoppingCart,
    description: "Online stores, DTC brands",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400"
  },
  { 
    id: "store" as ScenarioType, 
    name: "Local Store", 
    example: "Cedar & Stone Coffee",
    icon: StoreIcon,
    description: "Brick & mortar, retail, cafes",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400"
  },
  { 
    id: "hybrid" as ScenarioType, 
    name: "Hybrid", 
    example: "ELEVATE Fitness",
    icon: Layers,
    description: "Service + product combinations",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400"
  },
];

export function ScenarioSwitcher({ currentScenario, onScenarioChange }: ScenarioSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const current = scenarios.find(s => s.id === currentScenario) || scenarios[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
          isOpen 
            ? "bg-primary/10 border-primary/30 shadow-lg shadow-primary/10" 
            : "bg-card/50 border-border/50 hover:bg-card/80 hover:border-primary/20"
        }`}
      >
        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${current.gradient}`}>
          <current.icon className={`h-4 w-4 ${current.iconColor}`} />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-foreground">{current.name}</p>
          <p className="text-xs text-muted-foreground">{current.example}</p>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="absolute top-full right-0 mt-2 z-50 w-80"
            >
              <GlassCard className="p-3 overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-2 px-3 py-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Demo Scenario</span>
                </div>
                
                <div className="space-y-1">
                  {scenarios.map((scenario, index) => (
                    <motion.button
                      key={scenario.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      onClick={() => {
                        onScenarioChange(scenario.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left relative overflow-hidden ${
                        currentScenario === scenario.id 
                          ? `bg-gradient-to-r ${scenario.gradient} border border-primary/30` 
                          : "hover:bg-foreground/5"
                      }`}
                    >
                      {currentScenario === scenario.id && (
                        <motion.div
                          layoutId="activeScenario"
                          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"
                          transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        />
                      )}
                      
                      <div className={`relative z-10 p-2.5 rounded-xl bg-gradient-to-br ${scenario.gradient} border ${
                        currentScenario === scenario.id ? "border-primary/30" : "border-transparent"
                      }`}>
                        <scenario.icon className={`h-5 w-5 ${scenario.iconColor}`} />
                      </div>
                      
                      <div className="relative z-10 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm text-foreground">{scenario.name}</p>
                          {currentScenario === scenario.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="p-1 rounded-full bg-primary"
                            >
                              <Check className="h-3 w-3 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-xs text-primary/80 font-medium">{scenario.example}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{scenario.description}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Footer hint */}
                <div className="mt-3 pt-3 border-t border-border/50 px-3 pb-1">
                  <p className="text-xs text-muted-foreground text-center">
                    Switch scenarios to see different business contexts
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}