import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { 
  Wrench, 
  ShoppingCart, 
  Store as StoreIcon, 
  Layers,
  ChevronDown,
  Check
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
    description: "Home services, consulting, agencies"
  },
  { 
    id: "ecom" as ScenarioType, 
    name: "E-commerce", 
    example: "AURORA Skin",
    icon: ShoppingCart,
    description: "Online stores, DTC brands"
  },
  { 
    id: "store" as ScenarioType, 
    name: "Local Store", 
    example: "Cedar & Stone Coffee",
    icon: StoreIcon,
    description: "Brick & mortar, retail, cafes"
  },
  { 
    id: "hybrid" as ScenarioType, 
    name: "Hybrid", 
    example: "ELEVATE Fitness",
    icon: Layers,
    description: "Service + product combinations"
  },
];

export function ScenarioSwitcher({ currentScenario, onScenarioChange }: ScenarioSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const current = scenarios.find(s => s.id === currentScenario) || scenarios[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/50 border border-border/50 hover:bg-card/80 transition-colors text-sm"
      >
        <current.icon className="h-4 w-4 text-primary" />
        <span className="text-foreground font-medium">{current.name}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 z-50 w-72"
            >
              <GlassCard className="p-2">
                <p className="text-xs text-muted-foreground px-3 py-2">Demo Scenario</p>
                <div className="space-y-1">
                  {scenarios.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => {
                        onScenarioChange(scenario.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl transition-colors text-left ${
                        currentScenario === scenario.id 
                          ? "bg-primary/10 border border-primary/30" 
                          : "hover:bg-foreground/5"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        currentScenario === scenario.id ? "bg-primary/20" : "bg-foreground/5"
                      }`}>
                        <scenario.icon className={`h-4 w-4 ${
                          currentScenario === scenario.id ? "text-primary" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm text-foreground">{scenario.name}</p>
                          {currentScenario === scenario.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{scenario.example}</p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">{scenario.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
