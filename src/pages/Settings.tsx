import { useState } from "react";
import { motion } from "framer-motion";
import { ModuleLayout } from "@/components/ModuleLayout";
import { GlassCard } from "@/components/GlassCard";
import { Slider } from "@/components/ui/slider";
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Zap, 
  Palette,
  Volume2,
  Clock,
  AlertTriangle,
  Download,
  Trash2,
  Eye,
  MessageSquare,
  Rocket,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

type SettingsTab = "profile" | "autonomy" | "notifications" | "boundaries" | "data" | "appearance";

const TABS: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "autonomy", label: "Autonomy", icon: Zap },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "boundaries", label: "Boundaries", icon: Shield },
  { id: "data", label: "Data & Privacy", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("autonomy");
  const [autonomyLevel, setAutonomyLevel] = useState(2); // 0-3
  const [budgetCap, setBudgetCap] = useState(500);
  
  const autonomyLabels = ["Observe", "Suggest", "Act", "Autopilot"];

  return (
    <ModuleLayout title="Settings" subtitle="Boundaries" backTo="/">
      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1">
          <GlassCard className="p-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:bg-foreground/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </GlassCard>
        </div>

        {/* Content */}
        <div className="col-span-3 space-y-6">
          {activeTab === "autonomy" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-display font-medium text-foreground mb-1">
                  Autonomy Level
                </h2>
                <p className="text-sm text-muted-foreground">
                  How much should SITA do on its own?
                </p>
              </div>

              <GlassCard className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Current Level</span>
                    <span className="text-sm font-medium text-primary">{autonomyLabels[autonomyLevel]}</span>
                  </div>
                  <Slider
                    value={[autonomyLevel]}
                    onValueChange={([v]) => setAutonomyLevel(v)}
                    min={0}
                    max={3}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2">
                    {autonomyLabels.map((label, i) => (
                      <span key={label} className={`text-xs ${i === autonomyLevel ? "text-primary" : "text-muted-foreground"}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {[
                    { level: 0, icon: Eye, desc: "Watches and reports only" },
                    { level: 1, icon: MessageSquare, desc: "Proposes actions for approval" },
                    { level: 2, icon: Zap, desc: "Executes safe actions" },
                    { level: 3, icon: Rocket, desc: "Self-optimizes with guardrails" },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = autonomyLevel >= item.level;
                    return (
                      <div
                        key={item.level}
                        className={`p-3 rounded-xl text-center transition-all ${
                          isActive ? "bg-primary/10" : "bg-foreground/5 opacity-50"
                        }`}
                      >
                        <Icon className={`h-5 w-5 mx-auto mb-2 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  Safety Guardrails
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Never spend money without approval", locked: true, enabled: true },
                    { label: "Never message people without approval", locked: true, enabled: true },
                    { label: "Can adjust calendar automatically", locked: false, enabled: false },
                    { label: "Can enable focus mode automatically", locked: false, enabled: true },
                  ].map((guardrail, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">
                        {guardrail.label}
                        {guardrail.locked && <span className="ml-2 text-xs text-muted-foreground">(required)</span>}
                      </span>
                      <div className={`w-10 h-5 rounded-full transition-all ${guardrail.enabled ? "bg-primary" : "bg-foreground/20"} ${guardrail.locked ? "opacity-60" : ""}`}>
                        <div className={`w-4 h-4 rounded-full bg-foreground transition-transform mt-0.5 ${guardrail.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "boundaries" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-display font-medium text-foreground mb-1">
                  Boundaries
                </h2>
                <p className="text-sm text-muted-foreground">
                  How you want the system to operate
                </p>
              </div>

              <GlassCard className="p-6">
                <h3 className="text-sm font-medium text-foreground mb-4">Budget Caps</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Monthly spend limit</span>
                  <span className="text-sm font-medium text-primary">${budgetCap}</span>
                </div>
                <Slider
                  value={[budgetCap]}
                  onValueChange={([v]) => setBudgetCap(v)}
                  min={100}
                  max={5000}
                  step={100}
                  className="w-full"
                />
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Quiet Hours
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Start</label>
                    <input
                      type="time"
                      defaultValue="22:00"
                      className="w-full px-3 py-2 rounded-lg bg-foreground/5 text-foreground text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">End</label>
                    <input
                      type="time"
                      defaultValue="07:00"
                      className="w-full px-3 py-2 rounded-lg bg-foreground/5 text-foreground text-sm outline-none"
                    />
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6 border-destructive/30">
                <h3 className="text-sm font-medium text-destructive mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Emergency Stop
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This pauses outbound actions immediately.
                </p>
                <Button variant="destructive" className="w-full">
                  Stop All Automation
                </Button>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "data" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-display font-medium text-foreground mb-1">
                  Data & Privacy
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your data, your rules
                </p>
              </div>

              <GlassCard className="p-6">
                <h3 className="text-sm font-medium text-foreground mb-4">Data Storage Mode</h3>
                <div className="space-y-2">
                  {["Local-First", "Cloud", "Hybrid"].map((mode) => (
                    <button
                      key={mode}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all"
                    >
                      <span className="text-sm text-foreground">{mode}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-sm font-medium text-foreground mb-4">Data Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Download className="h-4 w-4" />
                    Export All Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Delete All Data
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "appearance" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-display font-medium text-foreground mb-1">
                  Appearance
                </h2>
                <p className="text-sm text-muted-foreground">
                  Customize your visual experience
                </p>
              </div>

              <GlassCard className="p-6">
                <h3 className="text-sm font-medium text-foreground mb-4">Theme</h3>
                <div className="flex gap-3">
                  {["Dark", "Light", "Auto"].map((theme) => (
                    <button
                      key={theme}
                      className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        theme === "Dark"
                          ? "bg-primary text-primary-foreground"
                          : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Sound & Haptics
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Ambient Sound</span>
                    <div className="w-10 h-5 rounded-full bg-foreground/20">
                      <div className="w-4 h-4 rounded-full bg-foreground mt-0.5 translate-x-0.5" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Haptic Feedback</span>
                    <div className="w-10 h-5 rounded-full bg-primary">
                      <div className="w-4 h-4 rounded-full bg-foreground mt-0.5 translate-x-5" />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-display font-medium text-foreground mb-1">
                  Notifications
                </h2>
                <p className="text-sm text-muted-foreground">
                  Control what reaches you
                </p>
              </div>

              <GlassCard className="p-6">
                <div className="space-y-4">
                  {[
                    { label: "Daily Summary", desc: "Morning briefing with key metrics", enabled: true },
                    { label: "Critical Alerts", desc: "Urgent issues requiring attention", enabled: true },
                    { label: "Revenue Updates", desc: "Payments and invoice activity", enabled: true },
                    { label: "Experiment Results", desc: "A/B test completions", enabled: false },
                    { label: "Integration Alerts", desc: "Connection status changes", enabled: true },
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-foreground">{notif.label}</span>
                        <p className="text-xs text-muted-foreground">{notif.desc}</p>
                      </div>
                      <div className={`w-10 h-5 rounded-full transition-all ${notif.enabled ? "bg-primary" : "bg-foreground/20"}`}>
                        <div className={`w-4 h-4 rounded-full bg-foreground mt-0.5 transition-transform ${notif.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-display font-medium text-foreground mb-1">
                  Profile
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your personal settings
                </p>
              </div>

              <GlassCard className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
                    <input
                      type="text"
                      defaultValue="Alex"
                      className="w-full px-4 py-2 rounded-lg bg-foreground/5 text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">SITA Mode</label>
                    <div className="flex gap-2">
                      {["Executive", "Coach", "Muse", "Analyst"].map((mode) => (
                        <button
                          key={mode}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            mode === "Executive"
                              ? "bg-primary text-primary-foreground"
                              : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </ModuleLayout>
  );
}
