import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { 
  X, 
  Zap, 
  Check, 
  AlertCircle, 
  ChevronRight,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Users,
  Shield,
  Settings
} from "lucide-react";

interface WorkflowPack {
  id: string;
  name: string;
  description: string;
  whatHappens: string[];
  channels: string[];
  status: "ready" | "needs_connection" | "pending_template";
  enabled: boolean;
  costEstimate: string;
  icon: typeof Zap;
}

interface WorkflowPacksProps {
  isOpen: boolean;
  onClose: () => void;
}

const packs: WorkflowPack[] = [
  {
    id: "instant-lead",
    name: "Instant Lead Response",
    description: "Respond to new leads within 60 seconds, 24/7.",
    whatHappens: [
      "Auto-respond to form submissions",
      "Qualify leads with 2-3 questions",
      "Book appointments if qualified",
      "Hand off to you if complex"
    ],
    channels: ["sms", "whatsapp", "email"],
    status: "ready",
    enabled: true,
    costEstimate: "$0.02 per lead",
    icon: Zap
  },
  {
    id: "quote-to-pay",
    name: "Quote → Pay Faster",
    description: "Turn quotes into payments with automated follow-ups.",
    whatHappens: [
      "Send quote within 10 minutes of request",
      "Follow up if unopened after 24h",
      "Nudge with urgency after 3 days",
      "Create invoice upon acceptance"
    ],
    channels: ["email", "sms"],
    status: "ready",
    enabled: false,
    costEstimate: "$0.05 per quote",
    icon: DollarSign
  },
  {
    id: "no-show-prevention",
    name: "No-Show Prevention",
    description: "Reduce no-shows with smart reminders.",
    whatHappens: [
      "Send confirmation immediately",
      "Remind 24h before",
      "Remind 2h before",
      "Offer reschedule if can't make it"
    ],
    channels: ["sms", "email"],
    status: "ready",
    enabled: true,
    costEstimate: "$0.03 per appointment",
    icon: Calendar
  },
  {
    id: "review-generation",
    name: "Review Generation",
    description: "Turn happy customers into 5-star reviews.",
    whatHappens: [
      "Ask for feedback post-service",
      "Route happy customers to Google/Yelp",
      "Route unhappy customers to support",
      "Thank customers for reviews"
    ],
    channels: ["sms", "email"],
    status: "ready",
    enabled: false,
    costEstimate: "$0.01 per request",
    icon: Users
  },
  {
    id: "dormant-reactivation",
    name: "Dormant Reactivation",
    description: "Wake up leads that went cold.",
    whatHappens: [
      "Identify leads inactive 30+ days",
      "Send personalized re-engagement",
      "Offer limited-time incentive",
      "Book callback if interested"
    ],
    channels: ["sms", "whatsapp", "email"],
    status: "needs_connection",
    enabled: false,
    costEstimate: "$0.04 per lead",
    icon: Shield
  },
  {
    id: "whatsapp-outreach",
    name: "WhatsApp Outreach",
    description: "Reach customers on their preferred channel.",
    whatHappens: [
      "Send updates via WhatsApp",
      "Share quotes and invoices",
      "Answer common questions",
      "Escalate complex queries"
    ],
    channels: ["whatsapp"],
    status: "pending_template",
    enabled: false,
    costEstimate: "$0.06 per message",
    icon: MessageSquare
  }
];

const channelIcons: Record<string, typeof Mail> = {
  sms: MessageSquare,
  whatsapp: MessageSquare,
  email: Mail,
  call: Phone
};

export function WorkflowPacks({ isOpen, onClose }: WorkflowPacksProps) {
  const [selectedPack, setSelectedPack] = useState<WorkflowPack | null>(null);
  const [packStates, setPackStates] = useState<Record<string, boolean>>(
    Object.fromEntries(packs.map(p => [p.id, p.enabled]))
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [autopilotLevel, setAutopilotLevel] = useState<"conservative" | "balanced" | "aggressive">("balanced");

  if (!isOpen) return null;

  const togglePack = (packId: string) => {
    const pack = packs.find(p => p.id === packId);
    if (pack?.status !== "ready") return;
    
    if (!packStates[packId]) {
      setSelectedPack(pack);
      setShowConfirm(true);
    } else {
      setPackStates(prev => ({ ...prev, [packId]: false }));
    }
  };

  const confirmEnable = () => {
    if (selectedPack) {
      setPackStates(prev => ({ ...prev, [selectedPack.id]: true }));
    }
    setShowConfirm(false);
    setSelectedPack(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 p-4 border-b border-border/50 bg-background/80 backdrop-blur-xl z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <h2 className="text-xl font-display font-medium text-foreground">Autopilot Packs</h2>
            <p className="text-sm text-muted-foreground">Choose outcomes. We handle implementation.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-border/50 hover:bg-foreground/5 transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-20">
        {/* Autopilot level selector */}
        <GlassCard className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Autopilot Level</p>
                <p className="text-xs text-muted-foreground">How aggressive should automation be?</p>
              </div>
            </div>
            <div className="flex gap-2">
              {(["conservative", "balanced", "aggressive"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setAutopilotLevel(level)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    autopilotLevel === level
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-muted-foreground hover:bg-foreground/5"
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Packs grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packs.map((pack) => {
            const Icon = pack.icon;
            const isEnabled = packStates[pack.id];
            
            return (
              <GlassCard
                key={pack.id}
                className={`p-5 transition-all ${
                  pack.status === "ready" ? "cursor-pointer" : "opacity-70"
                } ${isEnabled ? "ring-1 ring-secondary/50" : ""}`}
                onClick={() => pack.status === "ready" && setSelectedPack(pack)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isEnabled ? "bg-secondary/20" : "bg-primary/10"}`}>
                      <Icon className={`h-5 w-5 ${isEnabled ? "text-secondary" : "text-primary"}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{pack.name}</h3>
                      <p className="text-xs text-muted-foreground">{pack.description}</p>
                    </div>
                  </div>
                </div>

                {/* Channels */}
                <div className="flex items-center gap-2 mb-4">
                  {pack.channels.map((channel) => {
                    const ChannelIcon = channelIcons[channel];
                    return (
                      <div key={channel} className="p-1.5 rounded-lg bg-foreground/5">
                        <ChannelIcon className="h-3 w-3 text-muted-foreground" />
                      </div>
                    );
                  })}
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pack.status === "ready"
                      ? "bg-secondary/20 text-secondary"
                      : pack.status === "needs_connection"
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {pack.status === "ready" 
                      ? "Ready" 
                      : pack.status === "needs_connection"
                      ? "Needs Connection"
                      : "Waiting for WhatsApp template approval"}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePack(pack.id);
                    }}
                    disabled={pack.status !== "ready"}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isEnabled
                        ? "bg-secondary/20 text-secondary"
                        : pack.status === "ready"
                        ? "bg-primary/20 text-primary hover:bg-primary/30"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {isEnabled ? "Enabled" : "Enable"}
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Pack detail drawer */}
      <AnimatePresence>
        {selectedPack && !showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
            onClick={() => setSelectedPack(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <selectedPack.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">{selectedPack.name}</h3>
                  </div>
                  <button onClick={() => setSelectedPack(null)}>
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* What happens */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">What happens</h4>
                    <div className="space-y-2">
                      {selectedPack.whatHappens.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-secondary mt-0.5" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Channels */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">Channels used</h4>
                    <div className="flex gap-2">
                      {selectedPack.channels.map((channel) => {
                        const ChannelIcon = channelIcons[channel];
                        return (
                          <div key={channel} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/5">
                            <ChannelIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground capitalize">{channel}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cost estimate */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Cost estimate</h4>
                    <p className="text-sm text-muted-foreground">{selectedPack.costEstimate}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-border/50">
                    <button
                      onClick={() => {
                        if (selectedPack.status === "ready" && !packStates[selectedPack.id]) {
                          setShowConfirm(true);
                        }
                      }}
                      disabled={selectedPack.status !== "ready" || packStates[selectedPack.id]}
                      className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                        packStates[selectedPack.id]
                          ? "bg-secondary/20 text-secondary"
                          : selectedPack.status === "ready"
                          ? "bg-primary/20 text-primary hover:bg-primary/30"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      {packStates[selectedPack.id] ? "Enabled" : "Enable"}
                    </button>
                    <button
                      onClick={() => setSelectedPack(null)}
                      className="flex-1 py-3 rounded-xl bg-foreground/5 text-muted-foreground hover:bg-foreground/10 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation modal */}
      <AnimatePresence>
        {showConfirm && selectedPack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm"
            >
              <GlassCard className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Enable this pack?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  We'll start in Shadow Mode for 15 minutes.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={confirmEnable}
                    className="flex-1 py-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors font-medium"
                  >
                    Enable
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      setSelectedPack(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-foreground/5 text-muted-foreground hover:bg-foreground/10 transition-colors"
                  >
                    Not now
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
