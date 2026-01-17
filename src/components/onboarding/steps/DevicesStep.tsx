import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { 
  ChevronRight, 
  Check, 
  Calendar, 
  Watch, 
  Heart, 
  CreditCard,
  FileText,
  Home,
  Mail,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TIER_1_INTEGRATIONS = [
  { id: "calendar", label: "Calendar", icon: Calendar, desc: "Google / Apple" },
  { id: "health", label: "Health Data", icon: Heart, desc: "Oura / Apple Health / Google Fit" },
  { id: "stripe", label: "Revenue", icon: CreditCard, desc: "Stripe / Business accounts" },
];

const TIER_2_INTEGRATIONS = [
  { id: "notion", label: "Notion / Todoist", icon: FileText, desc: "Tasks & notes" },
  { id: "smarthome", label: "Smart Home", icon: Home, desc: "Hue / HomeKit" },
  { id: "email", label: "Email", icon: Mail, desc: "Read-only access" },
];

export function DevicesStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  
  const toggleIntegration = (id: string) => {
    const existing = data.integrations.find(i => i.provider === id);
    if (existing) {
      updateData("integrations", data.integrations.filter(i => i.provider !== id));
    } else {
      updateData("integrations", [
        ...data.integrations,
        { provider: id, status: "pending", scope: "standard", automationRights: "suggest" }
      ]);
    }
  };

  const isSelected = (id: string) => data.integrations.some(i => i.provider === id);
  const selectedCount = data.integrations.length;

  return (
    <motion.div
      className="flex flex-col items-center max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-3xl font-display font-medium text-foreground mb-2 text-center">
        Connect Your World
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        The more sources, the smarter SITA becomes
      </p>

      {/* Tier 1 - Recommended */}
      <div className="w-full mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-primary">Recommended</span>
          <div className="flex-1 h-px bg-primary/20" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {TIER_1_INTEGRATIONS.map((integration) => {
            const selected = isSelected(integration.id);
            const Icon = integration.icon;
            return (
              <GlassCard
                key={integration.id}
                className={`p-4 cursor-pointer transition-all duration-300 ${
                  selected
                    ? "ring-2 ring-secondary shadow-glow-cyan"
                    : "hover:border-secondary/30"
                }`}
                onClick={() => toggleIntegration(integration.id)}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className={`p-3 rounded-xl ${selected ? "bg-secondary/20" : "bg-foreground/5"}`}>
                    <Icon className={`h-6 w-6 ${selected ? "text-secondary" : "text-muted-foreground"}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{integration.label}</span>
                  <span className="text-xs text-muted-foreground">{integration.desc}</span>
                  {selected && (
                    <div className="flex items-center gap-1 text-xs text-secondary">
                      <Check className="h-3 w-3" />
                      Selected
                    </div>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Tier 2 - Optional */}
      <div className="w-full mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-muted-foreground">Optional</span>
          <div className="flex-1 h-px bg-foreground/10" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {TIER_2_INTEGRATIONS.map((integration) => {
            const selected = isSelected(integration.id);
            const Icon = integration.icon;
            return (
              <GlassCard
                key={integration.id}
                className={`p-4 cursor-pointer transition-all duration-300 ${
                  selected
                    ? "ring-2 ring-primary shadow-glow-gold"
                    : "hover:border-primary/30"
                }`}
                onClick={() => toggleIntegration(integration.id)}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className={`p-3 rounded-xl ${selected ? "bg-primary/20" : "bg-foreground/5"}`}>
                    <Icon className={`h-5 w-5 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{integration.label}</span>
                  <span className="text-xs text-muted-foreground">{integration.desc}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Preview */}
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mb-8"
        >
          <GlassCard className="p-4 border-secondary/30">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm text-foreground">
                {selectedCount} source{selectedCount > 1 ? "s" : ""} selected — 
                <span className="text-secondary"> data will sync after setup</span>
              </span>
            </div>
          </GlassCard>
        </motion.div>
      )}

      <p className="text-xs text-muted-foreground mb-6 text-center">
        You can connect more sources later. We'll never share your data.
      </p>

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
