import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { Share2, X, Sunrise, DollarSign, Users, Shield, TrendingUp } from "lucide-react";

interface WakeUpReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    earnings: number;
    leadsRecovered: number;
    invoicesCollected: number;
    risksAvoided: number;
    timeSaved: string;
  };
}

export function WakeUpReceipt({ 
  isOpen, 
  onClose, 
  data = {
    earnings: 142.50,
    leadsRecovered: 3,
    invoicesCollected: 1,
    risksAvoided: 1,
    timeSaved: "2.4 hrs"
  }
}: WakeUpReceiptProps) {
  if (!isOpen) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Wake-Up Receipt",
        text: `While I slept: $${data.earnings.toFixed(2)} earned, ${data.leadsRecovered} leads recovered, ${data.invoicesCollected} invoice collected.`,
      });
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
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-foreground/5 transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
              <Sunrise className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-display font-medium text-foreground">Wake-Up Receipt</h2>
              <p className="text-xs text-muted-foreground">What happened while you slept</p>
            </div>
          </div>

          {/* Main earning */}
          <div className="text-center py-6 mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm text-muted-foreground mb-2">Earned while you slept</p>
              <p className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                ${data.earnings.toFixed(2)}
              </p>
            </motion.div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-foreground/5"
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-secondary" />
                <span className="text-xs text-muted-foreground">Leads Recovered</span>
              </div>
              <p className="text-2xl font-semibold text-foreground">{data.leadsRecovered}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-xl bg-foreground/5"
            >
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Invoices Collected</span>
              </div>
              <p className="text-2xl font-semibold text-foreground">{data.invoicesCollected}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-xl bg-foreground/5"
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-secondary" />
                <span className="text-xs text-muted-foreground">Risks Avoided</span>
              </div>
              <p className="text-2xl font-semibold text-foreground">{data.risksAvoided}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 rounded-xl bg-foreground/5"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Time Saved</span>
              </div>
              <p className="text-2xl font-semibold text-foreground">{data.timeSaved}</p>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-colors text-sm font-medium text-foreground"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors text-sm font-medium text-muted-foreground"
            >
              Dismiss
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Everything important is handled.
          </p>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
