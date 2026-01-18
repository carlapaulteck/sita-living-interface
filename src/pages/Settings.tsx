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
  ChevronRight,
  Brain,
  Sparkles,
  Activity,
  Lock,
  EyeOff,
  Fingerprint,
  Smartphone,
  BellRing,
  BellOff,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCognitiveSafe } from "@/contexts/CognitiveContext";
import { useCognitiveSignals } from "@/hooks/useCognitiveSignals";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { toast } from "sonner";

type SettingsTab = "profile" | "autonomy" | "cognitive" | "personalization" | "notifications" | "boundaries" | "data" | "appearance" | "automations";

const TABS: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "autonomy", label: "Autonomy", icon: Zap },
  { id: "automations", label: "Automations", icon: Zap },
  { id: "cognitive", label: "Cognitive", icon: Brain },
  { id: "personalization", label: "Personalization", icon: Fingerprint },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "boundaries", label: "Boundaries", icon: Shield },
  { id: "data", label: "Data & Privacy", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
];

// Notifications Settings Component
function NotificationsSettings() {
  const { 
    isSupported, 
    permission, 
    isSubscribed, 
    isLoading, 
    subscribe, 
    unsubscribe 
  } = usePushNotifications();
  
  const [testingSend, setTestingSend] = useState(false);

  const handlePushToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
      toast.success("Push notifications disabled");
    } else {
      const success = await subscribe();
      if (success) {
        toast.success("Push notifications enabled!");
      } else {
        toast.error("Failed to enable push notifications");
      }
    }
  };

  const sendTestNotification = async () => {
    setTestingSend(true);
    try {
      // Show a local notification as a test
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('SITA Test Notification', {
          body: 'Push notifications are working correctly!',
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
        toast.success("Test notification sent!");
      }
    } catch (error) {
      toast.error("Failed to send test notification");
    } finally {
      setTestingSend(false);
    }
  };

  return (
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

      {/* Push Notifications Section */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-primary" />
          Push Notifications
        </h3>
        
        {!isSupported ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive">
            <BellOff className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Not Supported</p>
              <p className="text-xs opacity-80">Your browser doesn't support push notifications</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Push Status */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5">
              <div className="flex items-center gap-3">
                {isSubscribed ? (
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <BellRing className="h-5 w-5 text-primary" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <BellOff className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {isSubscribed ? "Push notifications enabled" : "Push notifications disabled"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isSubscribed 
                      ? "You'll receive alerts even when the app is closed" 
                      : "Enable to get notified of important updates"}
                  </p>
                </div>
              </div>
              <Button
                variant={isSubscribed ? "outline" : "default"}
                size="sm"
                onClick={handlePushToggle}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isSubscribed ? (
                  "Disable"
                ) : (
                  "Enable"
                )}
              </Button>
            </div>

            {/* Test Notification */}
            {isSubscribed && (
              <Button
                variant="outline"
                size="sm"
                onClick={sendTestNotification}
                disabled={testingSend}
                className="w-full"
              >
                {testingSend ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Send Test Notification
              </Button>
            )}

            {/* Permission Status */}
            {permission === 'denied' && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs">
                Notifications are blocked. Please enable them in your browser settings.
              </div>
            )}
          </div>
        )}
      </GlassCard>

      {/* Notification Categories */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Notification Types</h3>
        <div className="space-y-4">
          {[
            { label: "Daily Summary", desc: "Morning briefing with key metrics", enabled: true },
            { label: "Critical Alerts", desc: "Urgent issues requiring attention", enabled: true },
            { label: "Revenue Updates", desc: "Payments and invoice activity", enabled: true },
            { label: "Experiment Results", desc: "A/B test completions", enabled: false },
            { label: "Integration Alerts", desc: "Connection status changes", enabled: true },
            { label: "Cognitive State Changes", desc: "When your focus patterns shift", enabled: false },
          ].map((notif, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-foreground">{notif.label}</span>
                <p className="text-xs text-muted-foreground">{notif.desc}</p>
              </div>
              <div className={`w-10 h-5 rounded-full transition-all cursor-pointer ${notif.enabled ? "bg-primary" : "bg-foreground/20"}`}>
                <div className={`w-4 h-4 rounded-full bg-foreground mt-0.5 transition-transform ${notif.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Quiet Hours */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Quiet Hours
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          No push notifications during these hours (in-app notifications still work)
        </p>
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
    </motion.div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("autonomy");
  const [autonomyLevel, setAutonomyLevel] = useState(2); // 0-3
  const [budgetCap, setBudgetCap] = useState(500);
  
  const autonomyLabels = ["Observe", "Suggest", "Act", "Autopilot"];

  const tabs = TABS.map(t => ({ id: t.id, label: t.label }));

  return (
    <ModuleLayout 
      title="Settings" 
      subtitle="How you want the system to operate"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as SettingsTab)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Hidden on mobile, shown in tabs */}
        <div className="hidden lg:block lg:col-span-1">
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
        <div className="col-span-1 lg:col-span-3 space-y-6">
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
            <NotificationsSettings />
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

          {activeTab === "cognitive" && (
            <CognitiveSettingsTab />
          )}

          {activeTab === "personalization" && (
            <PersonalizationSettingsTab />
          )}

          {activeTab === "automations" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-display font-medium text-foreground mb-1">
                  Automations
                </h2>
                <p className="text-sm text-muted-foreground">
                  Background intelligence that works while you don't
                </p>
              </div>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground">Manage Automations</h3>
                      <p className="text-xs text-muted-foreground">
                        View history, create new automations, and manage existing ones
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = "/automations"}
                    className="gap-2"
                  >
                    Open
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-sm font-medium text-foreground mb-4">Quick Stats</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-display font-medium text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-display font-medium text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Runs Today</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-display font-medium text-foreground">100%</p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
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

// Cognitive Settings Tab Component
function CognitiveSettingsTab() {
  const cognitive = useCognitiveSafe();
  const signals = useCognitiveSignals({ enabled: false }); // Just for controls
  
  const adaptationModeLabels = ["Invisible", "Subtle", "Visible"];
  const adaptationModeValues: Array<"invisible" | "subtle" | "visible"> = ["invisible", "subtle", "visible"];
  const currentModeIndex = cognitive ? adaptationModeValues.indexOf(cognitive.adaptationMode) : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-display font-medium text-foreground mb-1">
          Cognitive Adaptation
        </h2>
        <p className="text-sm text-muted-foreground">
          How SITA adapts to your cognitive state
        </p>
      </div>

      {/* Current State Display */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Current State</h3>
              <p className="text-xs text-muted-foreground capitalize">
                {cognitive?.currentState || "Neutral"} • {Math.round((cognitive?.confidence || 0) * 100)}% confidence
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => cognitive?.refreshState()}>
            Refresh
          </Button>
        </div>
        
        {cognitive?.prediction && (
          <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 inline mr-1" />
              Predicted: <span className="text-foreground capitalize">{cognitive.prediction.nextState}</span> in ~{cognitive.prediction.timeToOnsetMinutes} minutes
            </p>
          </div>
        )}
      </GlassCard>

      {/* Adaptation Mode */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Adaptation Visibility
        </h3>
        <div className="mb-4">
          <Slider
            value={[currentModeIndex]}
            onValueChange={([v]) => cognitive?.setAdaptationMode(adaptationModeValues[v])}
            min={0}
            max={2}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-2">
            {adaptationModeLabels.map((label, i) => (
              <span key={label} className={`text-xs ${i === currentModeIndex ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {currentModeIndex === 0 && "Changes happen silently in the background."}
          {currentModeIndex === 1 && "Gentle adaptations you'll barely notice."}
          {currentModeIndex === 2 && "Clear visual feedback when adapting."}
        </p>
      </GlassCard>

      {/* Let Me Struggle */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">"Let Me Struggle" Mode</h3>
              <p className="text-xs text-muted-foreground">Disable all cognitive adaptations</p>
            </div>
          </div>
          <button
            onClick={() => cognitive?.setLetMeStruggle(!cognitive.letMeStruggle)}
            className={`w-12 h-6 rounded-full transition-all ${cognitive?.letMeStruggle ? "bg-destructive" : "bg-foreground/20"}`}
          >
            <div className={`w-5 h-5 rounded-full bg-foreground transition-transform mt-0.5 ${cognitive?.letMeStruggle ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>
      </GlassCard>

      {/* Signal Transparency */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Signal Transparency
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-sm text-muted-foreground">Signals captured</span>
            <span className="text-sm font-medium text-foreground">{signals.signalCount}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-sm text-muted-foreground">Capture status</span>
            <span className={`text-sm font-medium ${signals.isCapturing ? "text-green-400" : "text-muted-foreground"}`}>
              {signals.isCapturing ? "Active" : "Paused"}
            </span>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={signals.isCapturing ? signals.pauseCapture : signals.resumeCapture}
          >
            {signals.isCapturing ? "Pause" : "Resume"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-destructive hover:text-destructive"
            onClick={signals.deleteAllSignals}
          >
            Delete All
          </Button>
        </div>
      </GlassCard>

      {/* Explanation */}
      <GlassCard className="p-6 border-primary/30">
        <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          Why This Adaptation?
        </h3>
        <p className="text-sm text-muted-foreground">
          {cognitive?.explainWhy() || "No active adaptations."}
        </p>
      </GlassCard>
    </motion.div>
  );
}

// Personalization Settings Tab Component
function PersonalizationSettingsTab() {
  const [protectedTopics, setProtectedTopics] = useState<string[]>(["finances", "relationships"]);
  const [newTopic, setNewTopic] = useState("");

  const addProtectedTopic = () => {
    if (newTopic.trim() && !protectedTopics.includes(newTopic.trim())) {
      setProtectedTopics([...protectedTopics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const removeTopic = (topic: string) => {
    setProtectedTopics(protectedTopics.filter(t => t !== topic));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-display font-medium text-foreground mb-1">
          Personalization
        </h2>
        <p className="text-sm text-muted-foreground">
          How SITA learns and adapts to you
        </p>
      </div>

      {/* Protected Topics */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Protected Topics (Do Not Touch)
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          SITA will never adapt or make suggestions about these topics unless you explicitly ask.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {protectedTopics.map((topic) => (
            <span
              key={topic}
              className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm flex items-center gap-2"
            >
              {topic}
              <button onClick={() => removeTopic(topic)} className="hover:text-destructive">
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="Add a protected topic..."
            className="flex-1 px-3 py-2 rounded-lg bg-foreground/5 text-foreground text-sm outline-none"
            onKeyDown={(e) => e.key === "Enter" && addProtectedTopic()}
          />
          <Button variant="outline" size="sm" onClick={addProtectedTopic}>
            Add
          </Button>
        </div>
      </GlassCard>

      {/* Trust Level */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Trust & Assertiveness
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Suggestion acceptance rate</span>
            <span className="text-sm font-medium text-green-400">72%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Override frequency</span>
            <span className="text-sm font-medium text-amber-400">15%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">SITA assertiveness level</span>
            <span className="text-sm font-medium text-foreground">Moderate</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Based on your patterns, SITA adjusts how often and how strongly it makes suggestions.
        </p>
      </GlassCard>

      {/* Identity Modes */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <User className="h-4 w-4" />
          Identity Modes
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          SITA adapts its tone, pace, and UI density based on your current context.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { mode: "Work", desc: "Focused, formal", active: true },
            { mode: "Home", desc: "Relaxed, informal", active: false },
            { mode: "Social", desc: "Engaged, responsive", active: false },
            { mode: "Recovery", desc: "Minimal, quiet", active: false },
          ].map((item) => (
            <div
              key={item.mode}
              className={`p-3 rounded-xl text-center transition-all ${
                item.active ? "bg-primary/10 border border-primary/30" : "bg-foreground/5 border border-transparent"
              }`}
            >
              <p className={`text-sm font-medium ${item.active ? "text-primary" : "text-foreground"}`}>
                {item.mode}
              </p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Currently detected: <span className="text-primary">Work</span>
        </p>
      </GlassCard>

      {/* Resistance Respect */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <EyeOff className="h-4 w-4" />
          Resistance Respect
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Features you've consistently declined. SITA has stopped suggesting these.
        </p>
        <div className="space-y-2">
          {[
            { feature: "Morning meditation reminder", count: 5 },
            { feature: "Social media time tracking", count: 3 },
          ].map((item) => (
            <div key={item.feature} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm text-muted-foreground">{item.feature}</span>
              <span className="text-xs text-muted-foreground">Declined {item.count}x</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
