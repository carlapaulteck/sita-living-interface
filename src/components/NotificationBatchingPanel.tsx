import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell,
  BellOff,
  Clock,
  X,
  Inbox,
  Package,
  Send,
  Settings,
  Brain,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/GlassCard";
import { useNotificationBatching } from "@/hooks/useNotificationBatching";
import { useAdaptationSafe } from "@/contexts/AdaptationContext";

interface NotificationBatchingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationBatchingPanel({ isOpen, onClose }: NotificationBatchingPanelProps) {
  const { 
    batches, 
    pendingCount, 
    config, 
    isLoading,
    shouldBatch,
    deliverAllPending,
    updateConfig 
  } = useNotificationBatching();
  
  const adaptation = useAdaptationSafe();
  const [showSettings, setShowSettings] = useState(false);
  
  const batchStatus = shouldBatch();
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-lg my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-medium text-foreground flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Smart Notifications
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Intelligent notification batching based on your state
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Current Status */}
          <GlassCard className={`p-6 mb-6 ${batchStatus.batch ? "border-primary/30" : ""}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {batchStatus.batch ? (
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <BellOff className="h-6 w-6 text-primary" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center">
                    <Bell className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium text-foreground">
                    {batchStatus.batch ? "Batching Active" : "Delivering Instantly"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {batchStatus.batch ? batchStatus.reason : "Notifications arrive as they come"}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Cognitive State Indicator */}
            {adaptation?.momentState && adaptation.momentState !== "neutral" && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-foreground/5">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Current state: <span className="text-foreground capitalize">{adaptation.momentState}</span>
                </span>
              </div>
            )}
          </GlassCard>
          
          {/* Pending Notifications */}
          <GlassCard className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Inbox className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-sm font-medium text-foreground">Pending Notifications</h3>
                  <p className="text-xs text-muted-foreground">
                    {pendingCount} notifications being held
                  </p>
                </div>
              </div>
              
              {pendingCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deliverAllPending}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Deliver Now
                </Button>
              )}
            </div>
            
            {/* Pending Count Visual */}
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(pendingCount, 10) }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="w-3 h-3 rounded-full bg-primary/60"
                />
              ))}
              {pendingCount > 10 && (
                <span className="text-xs text-muted-foreground">+{pendingCount - 10} more</span>
              )}
              {pendingCount === 0 && (
                <span className="text-sm text-muted-foreground">No pending notifications</span>
              )}
            </div>
          </GlassCard>
          
          {/* Digest Times */}
          <GlassCard className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-medium text-foreground">Digest Schedule</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Batched notifications are delivered at these times:
            </p>
            <div className="flex flex-wrap gap-2">
              {config.digestTimes.map((time, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium"
                >
                  {time}
                </div>
              ))}
            </div>
          </GlassCard>
          
          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <GlassCard className="p-6 mb-6">
                  <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Batching Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Smart Batching</Label>
                        <p className="text-xs text-muted-foreground">
                          Automatically batch based on context
                        </p>
                      </div>
                      <Switch
                        checked={config.enabled}
                        onCheckedChange={(checked) => updateConfig({ enabled: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Batch During Focus</Label>
                        <p className="text-xs text-muted-foreground">
                          Hold notifications during flow state
                        </p>
                      </div>
                      <Switch
                        checked={config.batchDuringFocus}
                        onCheckedChange={(checked) => updateConfig({ batchDuringFocus: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Batch During Meetings</Label>
                        <p className="text-xs text-muted-foreground">
                          Hold notifications during calendar meetings
                        </p>
                      </div>
                      <Switch
                        checked={config.batchDuringMeetings}
                        onCheckedChange={(checked) => updateConfig({ batchDuringMeetings: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Batch During Overload</Label>
                        <p className="text-xs text-muted-foreground">
                          Hold notifications when overwhelmed
                        </p>
                      </div>
                      <Switch
                        checked={config.batchDuringOverload}
                        onCheckedChange={(checked) => updateConfig({ batchDuringOverload: checked })}
                      />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* How It Works */}
          <GlassCard className="p-6">
            <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              How Smart Batching Works
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs text-primary font-medium">1</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  When you're in deep focus, meetings, or feeling overwhelmed, non-urgent notifications are held.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs text-primary font-medium">2</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Urgent and critical notifications always come through immediately.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs text-primary font-medium">3</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Batched notifications are delivered at your scheduled digest times or when you're ready.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
