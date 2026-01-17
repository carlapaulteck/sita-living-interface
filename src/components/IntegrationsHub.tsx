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
  Heart
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
}

const integrations: Integration[] = [
  // Communication
  { id: "gmail", name: "Gmail", category: "communication", icon: Mail, status: "connected", description: "Email sync & automation" },
  { id: "whatsapp", name: "WhatsApp Business", category: "communication", icon: MessageSquare, status: "pending", description: "Business messaging", note: "Template approval pending" },
  { id: "sms", name: "SMS (Twilio)", category: "communication", icon: Smartphone, status: "connected", description: "Text messaging" },
  
  // Payments
  { id: "stripe", name: "Stripe", category: "payments", icon: CreditCard, status: "connected", description: "Payment processing" },
  { id: "square", name: "Square", category: "payments", icon: CreditCard, status: "disconnected", description: "In-person payments" },
  
  // Marketing
  { id: "meta", name: "Meta Ads", category: "marketing", icon: BarChart3, status: "connected", description: "Facebook & Instagram ads" },
  { id: "google", name: "Google Ads", category: "marketing", icon: Globe, status: "connected", description: "Search & display ads" },
  { id: "tiktok", name: "TikTok Ads", category: "marketing", icon: BarChart3, status: "disconnected", description: "Short-form video ads" },
  
  // Productivity
  { id: "calendar", name: "Google Calendar", category: "productivity", icon: Calendar, status: "connected", description: "Schedule sync" },
  { id: "notion", name: "Notion", category: "productivity", icon: Zap, status: "disconnected", description: "Notes & docs" },
  
  // Health
  { id: "oura", name: "Oura Ring", category: "health", icon: Watch, status: "connected", description: "Sleep & recovery" },
  { id: "apple-health", name: "Apple Health", category: "health", icon: Heart, status: "connected", description: "Health metrics" },
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

  if (!isOpen) return null;

  const filtered = activeCategory === "all" 
    ? integrations 
    : integrations.filter(i => i.category === activeCategory);

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
        className="w-full max-w-3xl max-h-[80vh] overflow-hidden"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2 relative z-10">
            {filtered.map((integration, i) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-foreground/5">
                      <integration.icon className="h-5 w-5 text-foreground" />
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

          {/* Footer note */}
          <div className="mt-6 p-4 rounded-xl bg-foreground/5 relative z-10">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium">WhatsApp templates</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Templates are required for the first message. Fallback is active until approval.
                </p>
              </div>
            </div>
          </div>

          {/* Cost note */}
          <p className="text-xs text-muted-foreground text-center mt-4 relative z-10">
            We'll always show cost before execution.
          </p>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
