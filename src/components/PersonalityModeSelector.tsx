import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { usePersonality, PersonalityMode, PERSONALITY_MODES } from "@/contexts/PersonalityContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface PersonalityModeSelectorProps {
  variant?: "dropdown" | "cards" | "compact";
  showDescription?: boolean;
  className?: string;
}

export function PersonalityModeSelector({
  variant = "dropdown",
  showDescription = true,
  className = ""
}: PersonalityModeSelectorProps) {
  const { currentMode, config, setMode, availableModes } = usePersonality();
  const [isOpen, setIsOpen] = useState(false);

  if (variant === "cards") {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${className}`}>
        {availableModes.map((mode) => (
          <motion.button
            key={mode.id}
            onClick={() => setMode(mode.id)}
            className={`relative p-4 rounded-xl border transition-all text-left ${
              currentMode === mode.id
                ? "border-primary bg-primary/10"
                : "border-border/50 bg-card/50 hover:border-primary/50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {currentMode === mode.id && (
              <motion.div
                className="absolute top-2 right-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Check className="w-4 h-4 text-primary" />
              </motion.div>
            )}
            <div className="text-2xl mb-2">{mode.icon}</div>
            <h3 className="font-medium text-foreground">{mode.name}</h3>
            {showDescription && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {mode.description}
              </p>
            )}
            <div 
              className="w-full h-1 rounded-full mt-3"
              style={{ backgroundColor: mode.colorAccent + "40" }}
            >
              <div 
                className="h-full rounded-full"
                style={{ 
                  backgroundColor: mode.colorAccent,
                  width: currentMode === mode.id ? "100%" : "0%",
                  transition: "width 0.3s ease"
                }}
              />
            </div>
          </motion.button>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {availableModes.map((mode) => (
          <motion.button
            key={mode.id}
            onClick={() => setMode(mode.id)}
            className={`p-2 rounded-lg border transition-all ${
              currentMode === mode.id
                ? "border-primary bg-primary/10"
                : "border-transparent hover:bg-card/50"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={mode.name}
          >
            <span className="text-lg">{mode.icon}</span>
          </motion.button>
        ))}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`gap-2 ${className}`}
          style={{ borderColor: config.colorAccent + "40" }}
        >
          <span className="text-lg">{config.icon}</span>
          <span>{config.name}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {availableModes.map((mode) => (
          <DropdownMenuItem
            key={mode.id}
            onClick={() => setMode(mode.id)}
            className={`flex items-start gap-3 p-3 cursor-pointer ${
              currentMode === mode.id ? "bg-primary/10" : ""
            }`}
          >
            <span className="text-xl">{mode.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{mode.name}</span>
                {currentMode === mode.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
              {showDescription && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {mode.description}
                </p>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
