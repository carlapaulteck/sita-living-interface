import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { 
  X, 
  Check, 
  AlertCircle, 
  Clock,
  Link2,
  ExternalLink,
  Zap,
  Mail,
  MessageSquare,
  Calendar,
  CreditCard,
  BarChart3,
  Globe,
  Smartphone,
  Watch,
  Heart,
  DollarSign,
  Info,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";

interface IntegrationsHubProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Integration {
  id: string;
  name: string;
  category: "communication" | "payments" | "marketing" | "productivity" | "health";
  icon: any;
  status: "connected" | "pending" | "disconnected";
  description: string;
  note?: string;
  costPerAction?: number;
  monthlyEstimate?: number;
  actionsThisMonth?: number;
  templateStatus?: "approved" | "pending" | "rejected";
  lastSync?: string;
}

const integrations: Integration[] = [
  // Communication
  { 
    id: "gmail", 
    name: "Gmail", 
    category: "communication", 
    icon: Mail, 
    status: "connected", 
    description: "Email sync & automation",
    costPerAction: 0,
    monthlyEstimate: 0,
    actionsThisMonth: 342,
    lastSync: "2 min ago"
  },
  { 
    id: "whatsapp", 
    name: "WhatsApp Business", 
    category: "communication", 
    icon: MessageSquare, 
    status: "pending", 
    description: "Business messaging", 
    note: "Template approval pending",
    costPerAction: 0.05,
    monthlyEstimate: 45,
    actionsThisMonth: 0,
    templateStatus: "pending"
  },
  { 
    id: "sms", 
    name: "SMS (Twilio)", 
    category: "communication", 
    icon: Smartphone, 
    status: "connected", 
    description: "Text messaging",
    costPerAction: 0.0075,
    monthlyEstimate: 28,
    actionsThisMonth: 3700,
    lastSync: "Live"
  },
  
  // Payments
  { 
    id: "stripe", 
    name: "Stripe", 
    category: "payments", 
    icon: CreditCard, 
    status: "connected", 
    description: "Payment processing",
    costPerAction: 0,
    monthlyEstimate: 0,
    actionsThisMonth: 156,
    lastSync: "Live"
  },
  { 
    id: "square", 
    name: "Square", 
    category: "payments", 
    icon: CreditCard, 
    status: "disconnected", 
    description: "In-person payments",
    costPerAction: 0,
    monthlyEstimate: 0
  },
  
  // Marketing
  { 
    id: "meta", 
    name: "Meta Ads", 
    category: "marketing", 
    icon: BarChart3, 
    status: "connected", 
    description: "Facebook & Instagram ads",
    costPerAction: 0,
    monthlyEstimate: 1840,
    actionsThisMonth: 24,
    lastSync: "5 min ago"
  },
  { 
    id: "google", 
    name: "Google Ads", 
    category: "marketing", 
    icon: Globe, 
    status: "connected", 
    description: "Search & display ads",
    costPerAction: 0,
    monthlyEstimate: 960,
    actionsThisMonth: 18,
    lastSync: "12 min ago"
  },
  { 
    id: "tiktok", 
    name: "TikTok Ads", 
    category: "marketing", 
    icon: BarChart3, 
    status: "disconnected", 
    description: "Short-form video ads",
    costPerAction: 0,
    monthlyEstimate: 0
  },
  
  // Productivity
  { 
    id: "calendar", 
    name: "Google Calendar", 
    category: "productivity", 
    icon: Calendar, 
    status: "connected", 
    description: "Schedule sync",
    costPerAction: 0,
    monthlyEstimate: 0,
    actionsThisMonth: 89,
    lastSync: "1 min ago"
  },
  { 
    id: "notion", 
    name: "Notion", 
    category: "productivity", 
    icon: Zap, 
    status: "disconnected", 
    description: "Notes & docs",
    costPerAction: 0,
    monthlyEstimate: 0
  },
  
  // Health
  { 
    id: "oura", 
    name: "Oura Ring", 
    category: "health", 
    icon: Watch, 
    status: "connected", 
    description: "Sleep & recovery",
    costPerAction: 0,
    monthlyEstimate: 0,
    actionsThisMonth: 720,
    lastSync: "4h ago"
  },
  { 
    id: "apple-health", 
    name: "Apple Health", 
    category: "health", 
    icon: Heart, 
    status: "connected", 
    description: "Health metrics",
    costPerAction: 0,
    monthlyEstimate: 0,
    actionsThisMonth: 1240,
    lastSync: "Live"
  },
];

const categories = [
  { id: "all", label: "All" },
  { id: "communication", label: "Communication" },
  { id: "payments", label: "Payments" },
  { id: "marketing", label: "Marketing" },
  { id: "productivity", label: "Productivity" },
  { id: "health", label: "Health" },
];

export function IntegrationsHub({ isOpen, onClose }: IntegrationsHubProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = activeCategory === "all" 
    ? integrations 
    : integrations.filter(i => i.category === activeCategory);

  const connectedCount = integrations.filter(i => i.status === "connected").length;
  const pendingCount = integrations.filter(i => i.status === "pending").length;
  const totalMonthlyCost = integrations.reduce((sum, i) => sum + (i.monthlyEstimate || 0), 0);

  const getStatusIcon = (status: Integration["status"]) => {
    switch (status) {
      case "connected": return <Check className="h-4 w-4 text-secondary" />;
      case "pending": return <Clock className="h-4 w-4 text-primary" />;
      default: return <Link2 className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: Integration["status"]) => {
    switch (status) {
      case "connected": return "bg-secondary/20 text-secondary";
      case "pending": return "bg-primary/20 text-primary";
      default: return "bg-muted/50 text-muted-foreground";
    }
  };

  const handleConnect = (integration: Integration) => {
    setConnecting(integration.id);
    setTimeout(() => {
      setConnecting(null);
    }, 2000);
  };

  const getTemplateStatusBadge = (status?: Integration["templateStatus"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center gap-1 text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
            <Clock className="h-3 w-3" />
            Pending Review
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

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
        className="w-full max-w-4xl max-h-[85vh] overflow-hidden"
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
            <h2 className="text-xl font-display font-medium text-foreground">Connections</h2>
            <p className="text-sm text-muted-foreground">Connect once. Everything adapts.</p>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
            <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                <span className="text-sm text-muted-foreground">Connected</span>
              </div>
              <p className="text-2xl font-display font-bold text-secondary mt-1">{connectedCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <p className="text-2xl font-display font-bold text-primary mt-1">{pendingCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-foreground/5 border border-foreground/10">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Est. Monthly</span>
              </div>
              <p className="text-2xl font-display font-bold text-foreground mt-1">${totalMonthlyCost.toLocaleString()}</p>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 relative z-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? "bg-primary/20 text-primary"
                    : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Integrations grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-2 relative z-10">
            {filtered.map((integration, i) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div 
                  className="p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer"
                  onClick={() => setSelectedIntegration(integration)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl ${
                      integration.status === "connected" 
                        ? "bg-secondary/10" 
                        : integration.status === "pending"
                        ? "bg-primary/10"
                        : "bg-foreground/5"
                    }`}>
                      <integration.icon className={`h-5 w-5 ${
                        integration.status === "connected"
                          ? "text-secondary"
                          : integration.status === "pending"
                          ? "text-primary"
                          : "text-foreground"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-foreground">{integration.name}</p>
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(integration.status)}`}>
                          {getStatusIcon(integration.status)}
                          {integration.status === "connected" ? "Connected" : 
                           integration.status === "pending" ? "Pending" : "Connect"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{integration.description}</p>
                      
                      {/* Cost preview */}
                      {integration.status === "connected" && integration.monthlyEstimate !== undefined && integration.monthlyEstimate > 0 && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ~${integration.monthlyEstimate}/mo
                        </p>
                      )}
                      
                      {integration.note && (
                        <p className="text-xs text-primary mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {integration.note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* WhatsApp Template Note */}
          <div className="mt-6 p-4 rounded-xl bg-foreground/5 relative z-10">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium">WhatsApp Templates</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Templates are required for the first message. Fallback is active until approval. 
                  Messages will be sent via SMS while templates are pending.
                </p>
              </div>
            </div>
          </div>

          {/* Cost note */}
          <div className="flex items-center justify-center gap-2 mt-4 relative z-10">
            <Info className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              We'll always show cost before execution.
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Cost Preview Modal */}
      <AnimatePresence>
        {selectedIntegration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm"
            onClick={() => setSelectedIntegration(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <GlassCard className="p-6 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="absolute top-4 right-4 p-2 rounded-xl hover:bg-foreground/5 transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>

                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className={`p-3 rounded-xl ${
                    selectedIntegration.status === "connected" 
                      ? "bg-secondary/20" 
                      : selectedIntegration.status === "pending"
                      ? "bg-primary/20"
                      : "bg-foreground/10"
                  }`}>
                    <selectedIntegration.icon className={`h-6 w-6 ${
                      selectedIntegration.status === "connected"
                        ? "text-secondary"
                        : selectedIntegration.status === "pending"
                        ? "text-primary"
                        : "text-foreground"
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-lg text-foreground">{selectedIntegration.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedIntegration.description}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-6 relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedIntegration.status)}`}>
                      {getStatusIcon(selectedIntegration.status)}
                      {selectedIntegration.status === "connected" ? "Connected" : 
                       selectedIntegration.status === "pending" ? "Pending" : "Not Connected"}
                    </span>
                  </div>
                  {selectedIntegration.lastSync && (
                    <p className="text-xs text-muted-foreground">Last sync: {selectedIntegration.lastSync}</p>
                  )}
                </div>

                {/* Template Status for WhatsApp */}
                {selectedIntegration.id === "whatsapp" && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mb-6 relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Template Status</span>
                      {getTemplateStatusBadge(selectedIntegration.templateStatus)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedIntegration.templateStatus === "pending" 
                        ? "Your message templates are being reviewed by WhatsApp. SMS fallback is active."
                        : selectedIntegration.templateStatus === "approved"
                        ? "Templates approved. WhatsApp messaging is fully operational."
                        : "Some templates were rejected. Please review and resubmit."}
                    </p>
                  </div>
                )}

                {/* Cost Breakdown */}
                <div className="p-4 rounded-xl bg-foreground/5 mb-6 relative z-10">
                  <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Cost Preview
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Cost per action</span>
                      <span className="text-sm font-medium text-foreground">
                        {selectedIntegration.costPerAction === 0 
                          ? "Free" 
                          : `$${selectedIntegration.costPerAction?.toFixed(4)}`}
                      </span>
                    </div>
                    {selectedIntegration.actionsThisMonth !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Actions this month</span>
                        <span className="text-sm font-medium text-foreground">
                          {selectedIntegration.actionsThisMonth.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Est. monthly cost</span>
                        <span className="text-lg font-display font-bold text-primary">
                          ${selectedIntegration.monthlyEstimate?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="relative z-10">
                  {selectedIntegration.status === "disconnected" ? (
                    <button
                      onClick={() => handleConnect(selectedIntegration)}
                      disabled={connecting === selectedIntegration.id}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {connecting === selectedIntegration.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Link2 className="h-4 w-4" />
                          Connect {selectedIntegration.name}
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedIntegration(null)}
                      className="w-full py-3 rounded-xl bg-foreground/10 text-foreground font-medium hover:bg-foreground/20 transition-colors"
                    >
                      Close
                    </button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}