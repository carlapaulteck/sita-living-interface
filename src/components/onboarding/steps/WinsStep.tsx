import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { ChevronRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NORTH_STAR_METRICS } from "@/types/onboarding";

const categoryColors = {
  wealth: "text-primary",
  health: "text-green-400",
  focus: "text-secondary",
  time: "text-purple-400",
};

const categoryBg = {
  wealth: "bg-primary/20",
  health: "bg-green-400/20",
  focus: "bg-secondary/20",
  time: "bg-purple-400/20",
};

export function WinsStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const selectedMetrics = data.northStarMetrics;

  const toggleMetric = (id: string) => {
    if (selectedMetrics.includes(id)) {
      updateData("northStarMetrics", selectedMetrics.filter(m => m !== id));
    } else if (selectedMetrics.length < 3) {
      updateData("northStarMetrics", [...selectedMetrics, id]);
    }
  };

  const selectedLabels = NORTH_STAR_METRICS
    .filter(m => selectedMetrics.includes(m.id))
    .map(m => m.label);

  return (
    <motion.div
      className="flex flex-col items-center max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-3xl font-display font-medium text-foreground mb-2 text-center">
        Define Your Wins
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        Pick up to 3 outcomes that matter most
      </p>

      <div className="grid grid-cols-2 gap-3 w-full mb-6">
        {NORTH_STAR_METRICS.map((metric) => {
          const isSelected = selectedMetrics.includes(metric.id);
          const isDisabled = !isSelected && selectedMetrics.length >= 3;
          
          return (
            <GlassCard
              key={metric.id}
              className={`p-4 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "ring-2 ring-primary shadow-glow-gold"
                  : isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-primary/30"
              }`}
              onClick={() => !isDisabled && toggleMetric(metric.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${categoryBg[metric.category]}`}>
                  {isSelected ? (
                    <Check className={`h-4 w-4 ${categoryColors[metric.category]}`} />
                  ) : (
                    <span className={`text-xs font-medium ${categoryColors[metric.category]}`}>
                      {metric.category.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">{metric.label}</span>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Preview card */}
      {selectedMetrics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mb-8"
        >
          <GlassCard className="p-4 border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Your Dashboard Preview</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your first dashboard will track: <span className="text-foreground">{selectedLabels.join(", ")}</span>
            </p>
          </GlassCard>
        </motion.div>
      )}

      <div className="flex gap-4">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button 
          onClick={nextStep} 
          className="gap-2"
          disabled={selectedMetrics.length === 0}
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
