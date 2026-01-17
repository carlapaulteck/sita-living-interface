import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { ChevronRight, Sun, Moon, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RhythmTemplate } from "@/types/onboarding";

const RHYTHM_TEMPLATES: {
  id: RhythmTemplate;
  label: string;
  icon: typeof Sun;
  desc: string;
  times: { wake: string; sleep: string };
}[] = [
  {
    id: "early-bird",
    label: "Early Bird",
    icon: Sun,
    desc: "Rise with the sun, peak morning focus",
    times: { wake: "05:30", sleep: "21:30" },
  },
  {
    id: "night-owl",
    label: "Night Owl",
    icon: Moon,
    desc: "Creative evening hours, later mornings",
    times: { wake: "08:30", sleep: "00:30" },
  },
  {
    id: "split-schedule",
    label: "Split Schedule",
    icon: Sparkles,
    desc: "Morning + evening peaks, afternoon rest",
    times: { wake: "06:30", sleep: "22:30" },
  },
  {
    id: "rotating",
    label: "Rotating",
    icon: RotateCcw,
    desc: "Flexible schedule, adapts to context",
    times: { wake: "07:00", sleep: "23:00" },
  },
];

export function RhythmStep() {
  const { data, updateData, updateNestedData, nextStep, prevStep } = useOnboarding();

  const selectTemplate = (template: typeof RHYTHM_TEMPLATES[0]) => {
    updateNestedData("dailyRhythm", "template", template.id);
    updateNestedData("dailyRhythm", "wakeTime", template.times.wake);
    updateNestedData("dailyRhythm", "sleepTime", template.times.sleep);
  };

  return (
    <motion.div
      className="flex flex-col items-center max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-3xl font-display font-medium text-foreground mb-2 text-center">
        Map Your Day
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        When are you at your best?
      </p>

      <div className="grid grid-cols-2 gap-4 w-full mb-8">
        {RHYTHM_TEMPLATES.map((template) => {
          const isSelected = data.dailyRhythm.template === template.id;
          const Icon = template.icon;
          
          return (
            <GlassCard
              key={template.id}
              className={`p-5 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "ring-2 ring-primary shadow-glow-gold"
                  : "hover:border-primary/30"
              }`}
              onClick={() => selectTemplate(template)}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isSelected ? "bg-primary/20" : "bg-foreground/5"}`}>
                    <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <span className="font-medium text-foreground">{template.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{template.desc}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Wake: {template.times.wake}</span>
                  <span>Sleep: {template.times.sleep}</span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Time adjustments */}
      <GlassCard className="w-full p-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Wake Time
            </label>
            <input
              type="time"
              value={data.dailyRhythm.wakeTime}
              onChange={(e) => updateNestedData("dailyRhythm", "wakeTime", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-foreground/5 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Sleep Time
            </label>
            <input
              type="time"
              value={data.dailyRhythm.sleepTime}
              onChange={(e) => updateNestedData("dailyRhythm", "sleepTime", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-foreground/5 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </GlassCard>

      <div className="flex gap-4">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep} className="gap-2">
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
