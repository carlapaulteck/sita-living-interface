import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { toast } from "sonner";
import {
  Bell,
  BellOff,
  BellRing,
  Check,
  AlertCircle,
  Smartphone,
  Moon,
  Brain,
  TrendingUp,
  Settings,
  Send,
  X,
} from "lucide-react";

interface PushNotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationCategory {
  id: string;
  label: string;
  description: string;
  icon: any;
  enabled: boolean;
}

export function PushNotificationSettings({ isOpen, onClose }: PushNotificationSettingsProps) {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    sendTestNotification,
  } = usePushNotifications();

  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: "critical",
      label: "Critical Alerts",
      description: "Urgent issues requiring immediate attention",
      icon: AlertCircle,
      enabled: true,
    },
    {
      id: "habits",
      label: "Habit Reminders",
      description: "Daily habit tracking notifications",
      icon: BellRing,
      enabled: true,
    },
    {
      id: "insights",
      label: "Insights & Reports",
      description: "Weekly insights and performance updates",
      icon: TrendingUp,
      enabled: true,
    },
    {
      id: "cognitive",
      label: "Cognitive Updates",
      description: "State changes and recovery suggestions",
      icon: Brain,
      enabled: false,
    },
    {
      id: "system",
      label: "System Updates",
      description: "Platform updates and maintenance notices",
      icon: Settings,
      enabled: false,
    },
  ]);

  const [isSendingTest, setIsSendingTest] = useState(false);

  if (!isOpen) return null;

  const handleToggleSubscription = async () => {
    if (isSubscribed) {
      const success = await unsubscribe();
      if (success) {
        toast.success("Push notifications disabled");
      }
    } else {
      const success = await subscribe();
      if (success) {
        toast.success("Push notifications enabled");
      }
    }
  };

  const handleTestNotification = async () => {
    setIsSendingTest(true);
    try {
      await sendTestNotification();
      toast.success("Test notification sent!");
    } catch (err) {
      toast.error("Failed to send test notification");
    } finally {
      setIsSendingTest(false);
    }
  };

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, enabled: !cat.enabled } : cat
      )
    );
  };

  const getPermissionStatus = () => {
    if (!isSupported) {
      return { icon: BellOff, text: "Not supported", color: "text-muted-foreground" };
    }
    if (permission === "denied") {
      return { icon: BellOff, text: "Blocked by browser", color: "text-destructive" };
    }
    if (isSubscribed) {
      return { icon: Check, text: "Enabled", color: "text-secondary" };
    }
    return { icon: Bell, text: "Not enabled", color: "text-muted-foreground" };
  };

  const status = getPermissionStatus();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[80vh] overflow-hidden"
      >
        <GlassCard className="p-6 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-foreground/5 transition-colors z-10"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Header */}
          <div className="mb-6 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary/20">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-display font-medium text-foreground">
                Push Notifications
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Stay informed with real-time updates
            </p>
          </div>

          <div className="space-y-6 relative z-10 max-h-[60vh] overflow-y-auto pr-2">
            {/* Status Card */}
            <div className="p-4 rounded-xl bg-foreground/5 border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-foreground/5 ${status.color}`}>
                    <status.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">Status</p>
                    <p className={`text-xs ${status.color}`}>{status.text}</p>
                  </div>
                </div>
                {isSupported && permission !== "denied" && (
                  <Switch
                    checked={isSubscribed}
                    onCheckedChange={handleToggleSubscription}
                    disabled={isLoading}
                  />
                )}
              </div>

              {permission === "denied" && (
                <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-xs text-destructive">
                    Notifications are blocked by your browser. Please enable them in your browser settings.
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-xs text-destructive">{error}</p>
                </div>
              )}
            </div>

            {/* Test Notification */}
            {isSubscribed && (
              <Button
                onClick={handleTestNotification}
                disabled={isSendingTest}
                variant="outline"
                className="w-full gap-2"
              >
                <Send className="h-4 w-4" />
                {isSendingTest ? "Sending..." : "Send Test Notification"}
              </Button>
            )}

            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Notification Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-foreground/5">
                          <category.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{category.label}</p>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={category.enabled}
                        onCheckedChange={() => toggleCategory(category.id)}
                        disabled={!isSubscribed}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quiet Hours Note */}
            <div className="p-4 rounded-xl bg-foreground/5 border border-border/50">
              <div className="flex items-start gap-3">
                <Moon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Quiet Hours</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Notifications respect your quiet hours and cognitive state. Critical alerts may still come through.
                  </p>
                </div>
              </div>
            </div>

            {/* Device Note */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Smartphone className="h-4 w-4" />
              <span>Push notifications work best on mobile devices and modern browsers</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-border/50 relative z-10">
            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
