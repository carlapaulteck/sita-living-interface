import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { HelpHint } from "@/components/HelpHint";
import { ChevronRight, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import avatarImage from "@/assets/avatar.jpg";

export function NameStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();

  return (
    <motion.div
      className="flex flex-col items-center max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="relative w-32 h-32 mb-6">
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary/60 to-secondary/60 blur-lg opacity-60 animate-pulse" />
        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-primary/40">
          <img 
            src={avatarImage} 
            alt="SITA" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-3xl font-display font-medium text-foreground text-center">
          What should I call you?
        </h2>
        <HelpHint 
          hint="SITA will use this to personalize messages. You can change it anytime in Settings."
          variant="info"
        />
      </div>
      <p className="text-muted-foreground mb-4 text-center">
        This makes every interaction personal
      </p>
      <div className="flex items-center justify-center gap-2 mb-6 text-xs text-muted-foreground">
        <Volume2 className="h-3 w-3" />
        <span>Used in voice features too</span>
      </div>

      <GlassCard className="p-1 mb-8 w-full">
        <input
          type="text"
          value={data.name}
          onChange={(e) => updateData("name", e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 bg-transparent text-center text-lg outline-none placeholder:text-muted-foreground/50 text-foreground"
          autoFocus
        />
      </GlassCard>

      <div className="flex gap-4">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button 
          onClick={nextStep} 
          className="gap-2"
          disabled={!data.name.trim()}
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
