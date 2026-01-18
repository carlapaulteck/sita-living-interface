import { motion } from "framer-motion";
import { Utensils, Clock, Heart, AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Switch } from "@/components/ui/switch";

interface Preference {
  id: string;
  label: string;
  value: string;
  icon: typeof Utensils;
  enabled: boolean;
}

const DIETARY_PREFS: Preference[] = [
  { id: "1", label: "Vegetarian Options", value: "For Emma", icon: Utensils, enabled: true },
  { id: "2", label: "Nut-Free", value: "Allergy", icon: AlertTriangle, enabled: true },
  { id: "3", label: "Low Sugar", value: "Health goal", icon: Heart, enabled: false },
];

const SCHEDULE_PREFS = [
  { id: "1", label: "School Days Wake Up", value: "6:30 AM", editable: true },
  { id: "2", label: "Weekend Wake Up", value: "8:00 AM", editable: true },
  { id: "3", label: "Bedtime (Kids)", value: "9:00 PM", editable: true },
  { id: "4", label: "Family Dinner", value: "6:30 PM", editable: true },
];

export function FamilyPreferences() {
  return (
    <div className="space-y-6">
      {/* Dietary Preferences */}
      <GlassCard className="p-6" hover={false}>
        <h3 className="text-lg font-display font-medium text-foreground mb-4">Dietary Preferences</h3>
        <div className="space-y-4">
          {DIETARY_PREFS.map((pref, index) => (
            <motion.div
              key={pref.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <pref.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{pref.label}</p>
                  <p className="text-sm text-muted-foreground">{pref.value}</p>
                </div>
              </div>
              <Switch checked={pref.enabled} />
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Schedule Preferences */}
      <GlassCard className="p-6" hover={false}>
        <h3 className="text-lg font-display font-medium text-foreground mb-4">Family Schedule</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SCHEDULE_PREFS.map((pref, index) => (
            <motion.div
              key={pref.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50"
            >
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">{pref.label}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{pref.value}</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Family Values */}
      <GlassCard className="p-6" hover={false}>
        <h3 className="text-lg font-display font-medium text-foreground mb-4">Family Values</h3>
        <div className="flex flex-wrap gap-2">
          {["Education", "Health", "Quality Time", "Creativity", "Kindness", "Adventure"].map((value, index) => (
            <motion.span
              key={value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-sm text-secondary"
            >
              {value}
            </motion.span>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
