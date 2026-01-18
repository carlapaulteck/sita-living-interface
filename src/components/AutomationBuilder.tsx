import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Zap,
  Plus,
  Clock,
  Database,
  Calendar,
  Gauge,
  Bell,
  CalendarClock,
  Heart,
  Wrench,
  ArrowDown,
  X,
  Check,
  Sparkles,
  Play,
  Save,
  ChevronRight,
  Info,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  TRIGGER_OPTIONS,
  ACTION_OPTIONS,
  TRIGGER_CATEGORY_COLORS,
  ACTION_CATEGORY_COLORS,
  type TriggerConfig,
  type ActionConfig,
  type ActionItem,
} from "@/types/automations";

const CATEGORY_ICONS = {
  time: Clock,
  data: Database,
  event: Calendar,
  condition: Gauge,
  notification: Bell,
  schedule: CalendarClock,
  wellness: Heart,
  custom: Wrench,
};

interface AutomationBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export function AutomationBuilder({ isOpen, onClose, onSave }: AutomationBuilderProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<"trigger" | "action" | "configure">("trigger");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTrigger, setSelectedTrigger] = useState<{
    category: keyof typeof TRIGGER_OPTIONS;
    id: string;
    label: string;
  } | null>(null);
  const [selectedActions, setSelectedActions] = useState<
    Array<{ category: keyof typeof ACTION_OPTIONS; id: string; label: string }>
  >([]);
  const [triggerConfig, setTriggerConfig] = useState<Partial<TriggerConfig>>({});
  const [saving, setSaving] = useState(false);

  const handleSelectTrigger = (
    category: keyof typeof TRIGGER_OPTIONS,
    trigger: (typeof TRIGGER_OPTIONS)[keyof typeof TRIGGER_OPTIONS][number]
  ) => {
    setSelectedTrigger({ category, id: trigger.id, label: trigger.label });
    setStep("action");
  };

  const handleSelectAction = (
    category: keyof typeof ACTION_OPTIONS,
    action: (typeof ACTION_OPTIONS)[keyof typeof ACTION_OPTIONS][number]
  ) => {
    const exists = selectedActions.some((a) => a.id === action.id);
    if (exists) {
      setSelectedActions(selectedActions.filter((a) => a.id !== action.id));
    } else if (selectedActions.length < 3) {
      setSelectedActions([...selectedActions, { category, id: action.id, label: action.label }]);
    }
  };

  const handleSave = async () => {
    if (!selectedTrigger || selectedActions.length === 0 || !name) {
      toast.error("Please complete all required fields");
      return;
    }

    setSaving(true);
    try {
      const automation = {
        user_id: user?.id,
        name,
        description,
        trigger_type: selectedTrigger.id,
        trigger_config: {
          category: selectedTrigger.category,
          ...triggerConfig,
        },
        action_type: selectedActions[0].id,
        action_config: {
          actions: selectedActions.map((a) => ({
            type: a.category,
            action: a.id,
          })),
        },
        is_enabled: true,
        priority: 0,
        cooldown_minutes: 30,
      };

      if (user) {
        const { error } = await supabase.from("user_automations").insert(automation);
        if (error) throw error;
      }

      toast.success("Automation created successfully!");
      onSave?.();
      handleReset();
      onClose();
    } catch (error) {
      console.error("Error saving automation:", error);
      toast.error("Failed to save automation");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setStep("trigger");
    setName("");
    setDescription("");
    setSelectedTrigger(null);
    setSelectedActions([]);
    setTriggerConfig({});
  };

  const canProceedToConfig = selectedTrigger && selectedActions.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="font-display">Custom Automation Builder</DialogTitle>
              <DialogDescription>
                Create your own trigger-action automation
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6">
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mb-6">
              {["trigger", "action", "configure"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (s === "trigger") setStep("trigger");
                      else if (s === "action" && selectedTrigger) setStep("action");
                      else if (s === "configure" && canProceedToConfig) setStep("configure");
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      step === s
                        ? "bg-primary text-primary-foreground"
                        : i < ["trigger", "action", "configure"].indexOf(step)
                        ? "bg-primary/20 text-primary"
                        : "bg-foreground/5 text-muted-foreground"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">
                      {i + 1}
                    </span>
                    <span className="capitalize">{s}</span>
                  </button>
                  {i < 2 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === "trigger" && (
                <motion.div
                  key="trigger"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center text-xs">
                        WHEN
                      </span>
                      Select a Trigger
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Choose what event or condition should activate this automation
                    </p>
                  </div>

                  <Tabs defaultValue="time" className="w-full">
                    <TabsList className="grid grid-cols-4 mb-4">
                      {(Object.keys(TRIGGER_OPTIONS) as Array<keyof typeof TRIGGER_OPTIONS>).map(
                        (cat) => {
                          const Icon = CATEGORY_ICONS[cat];
                          return (
                            <TabsTrigger key={cat} value={cat} className="capitalize text-xs">
                              <Icon className="h-3.5 w-3.5 mr-1.5" />
                              {cat}
                            </TabsTrigger>
                          );
                        }
                      )}
                    </TabsList>

                    {(Object.entries(TRIGGER_OPTIONS) as [keyof typeof TRIGGER_OPTIONS, typeof TRIGGER_OPTIONS[keyof typeof TRIGGER_OPTIONS]][]).map(
                      ([cat, triggers]) => (
                        <TabsContent key={cat} value={cat}>
                          <div className="grid gap-2">
                            {triggers.map((trigger) => (
                              <button
                                key={trigger.id}
                                onClick={() => handleSelectTrigger(cat, trigger)}
                                className={`w-full p-4 rounded-xl border text-left transition-all hover:bg-foreground/5 ${
                                  selectedTrigger?.id === trigger.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border/50"
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-medium text-foreground text-sm">
                                      {trigger.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {trigger.description}
                                    </p>
                                  </div>
                                  {selectedTrigger?.id === trigger.id && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </TabsContent>
                      )
                    )}
                  </Tabs>
                </motion.div>
              )}

              {step === "action" && (
                <motion.div
                  key="action"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {/* Selected Trigger Preview */}
                  {selectedTrigger && (
                    <div className="mb-4 p-3 rounded-xl bg-secondary/10 border border-secondary/20">
                      <div className="flex items-center gap-2 text-xs text-secondary">
                        <span className="font-medium">WHEN:</span>
                        <span>{selectedTrigger.label}</span>
                        <button
                          onClick={() => setStep("trigger")}
                          className="ml-auto p-1 hover:bg-secondary/20 rounded"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Flow Connector */}
                  <div className="flex justify-center my-3">
                    <div className="flex flex-col items-center">
                      <ArrowDown className="h-5 w-5 text-primary animate-bounce" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-xs">
                        THEN
                      </span>
                      Select Actions ({selectedActions.length}/3)
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Choose up to 3 actions to perform when triggered
                    </p>
                  </div>

                  <Tabs defaultValue="notification" className="w-full">
                    <TabsList className="grid grid-cols-4 mb-4">
                      {(Object.keys(ACTION_OPTIONS) as Array<keyof typeof ACTION_OPTIONS>).map(
                        (cat) => {
                          const Icon = CATEGORY_ICONS[cat];
                          return (
                            <TabsTrigger key={cat} value={cat} className="capitalize text-xs">
                              <Icon className="h-3.5 w-3.5 mr-1.5" />
                              {cat}
                            </TabsTrigger>
                          );
                        }
                      )}
                    </TabsList>

                    {(Object.entries(ACTION_OPTIONS) as [keyof typeof ACTION_OPTIONS, typeof ACTION_OPTIONS[keyof typeof ACTION_OPTIONS]][]).map(
                      ([cat, actions]) => (
                        <TabsContent key={cat} value={cat}>
                          <div className="grid gap-2">
                            {actions.map((action) => {
                              const isSelected = selectedActions.some((a) => a.id === action.id);
                              return (
                                <button
                                  key={action.id}
                                  onClick={() => handleSelectAction(cat, action)}
                                  className={`w-full p-4 rounded-xl border text-left transition-all hover:bg-foreground/5 ${
                                    isSelected
                                      ? "border-primary bg-primary/5"
                                      : "border-border/50"
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="font-medium text-foreground text-sm">
                                        {action.label}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        {action.description}
                                      </p>
                                    </div>
                                    {isSelected && (
                                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <Check className="h-3 w-3 text-primary-foreground" />
                                      </div>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </TabsContent>
                      )
                    )}
                  </Tabs>

                  {/* Selected Actions Preview */}
                  {selectedActions.length > 0 && (
                    <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20">
                      <p className="text-xs text-muted-foreground mb-2">Selected actions:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedActions.map((action) => (
                          <Badge
                            key={action.id}
                            variant="secondary"
                            className="pr-1"
                          >
                            {action.label}
                            <button
                              onClick={() =>
                                setSelectedActions(
                                  selectedActions.filter((a) => a.id !== action.id)
                                )
                              }
                              className="ml-1 p-0.5 hover:bg-foreground/10 rounded"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {step === "configure" && (
                <motion.div
                  key="configure"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {/* Summary */}
                  <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-primary/10 border border-border/50">
                    <h4 className="text-sm font-medium text-foreground mb-3">
                      Automation Flow
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 p-3 rounded-lg bg-secondary/20 border border-secondary/30">
                        <p className="text-[10px] text-secondary font-medium mb-1">WHEN</p>
                        <p className="text-xs text-foreground">{selectedTrigger?.label}</p>
                      </div>
                      <ArrowDown className="h-5 w-5 text-muted-foreground rotate-[-90deg]" />
                      <div className="flex-1 p-3 rounded-lg bg-primary/20 border border-primary/30">
                        <p className="text-[10px] text-primary font-medium mb-1">THEN</p>
                        <p className="text-xs text-foreground">
                          {selectedActions.map((a) => a.label).join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Automation Name *
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Deep Work Focus Guard"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Description
                      </label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What does this automation help you achieve?"
                        className="mt-1.5"
                        rows={2}
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-foreground/5 border border-border/50">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            How it works
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            When <span className="text-secondary">{selectedTrigger?.label.toLowerCase()}</span>, 
                            SITA will automatically{" "}
                            <span className="text-primary">
                              {selectedActions.map((a) => a.label.toLowerCase()).join(" and ")}
                            </span>
                            . You'll see the results in your morning briefing and automation history.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/50 flex items-center justify-between bg-background/50">
          <Button variant="ghost" onClick={handleReset}>
            Reset
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {step !== "configure" ? (
              <Button
                onClick={() => {
                  if (step === "trigger" && selectedTrigger) setStep("action");
                  else if (step === "action" && canProceedToConfig) setStep("configure");
                }}
                disabled={
                  (step === "trigger" && !selectedTrigger) ||
                  (step === "action" && !canProceedToConfig)
                }
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={saving || !name}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Create Automation"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
