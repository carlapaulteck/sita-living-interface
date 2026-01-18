import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { 
  Share2, 
  X, 
  Sunrise, 
  DollarSign, 
  Users, 
  Shield, 
  TrendingUp,
  Clock,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Bot,
  MessageSquare,
  Mail
} from "lucide-react";
import { useState, useEffect } from "react";

interface WakeUpReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    earnings: number;
    leadsRecovered: number;
    invoicesCollected: number;
    risksAvoided: number;
    timeSaved: string;
    tasksCompleted: number;
    messagesHandled: number;
  };
}

const activities = [
  { icon: Mail, label: "Sent 3 follow-up emails", time: "2:34 AM", status: "success" },
  { icon: Users, label: "Recovered 2 abandoned leads", time: "3:12 AM", status: "success" },
  { icon: DollarSign, label: "Collected invoice #1082", time: "4:45 AM", status: "success" },
  { icon: Shield, label: "Blocked suspicious login attempt", time: "5:20 AM", status: "protected" },
  { icon: MessageSquare, label: "Responded to 5 inquiries", time: "6:01 AM", status: "success" },
];

export function WakeUpReceipt({ 
  isOpen, 
  onClose, 
  data = {
    earnings: 247.80,
    leadsRecovered: 3,
    invoicesCollected: 1,
    risksAvoided: 2,
    timeSaved: "3.2 hrs",
    tasksCompleted: 12,
    messagesHandled: 8
  }
}: WakeUpReceiptProps) {
  const [animatedEarnings, setAnimatedEarnings] = useState(0);
  
  useEffect(() => {
    if (isOpen) {
      const duration = 1500;
      const steps = 60;
      const increment = data.earnings / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= data.earnings) {
          setAnimatedEarnings(data.earnings);
          clearInterval(timer);
        } else {
          setAnimatedEarnings(current);
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [isOpen, data.earnings]);

  if (!isOpen) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Wake-Up Receipt",
        text: `While I slept: $${data.earnings.toFixed(2)} earned, ${data.leadsRecovered} leads recovered, ${data.invoicesCollected} invoice collected, ${data.timeSaved} saved.`,
      });
    }
  };

  const stats = [
    { 
      icon: Users, 
      label: "Leads Recovered", 
      value: data.leadsRecovered,
      gradient: "from-cyan-500 to-blue-600",
      glow: "shadow-cyan-500/20"
    },
    { 
      icon: DollarSign, 
      label: "Invoices Collected", 
      value: data.invoicesCollected,
      gradient: "from-emerald-500 to-teal-600",
      glow: "shadow-emerald-500/20"
    },
    { 
      icon: Shield, 
      label: "Risks Avoided", 
      value: data.risksAvoided,
      gradient: "from-violet-500 to-purple-600",
      glow: "shadow-violet-500/20"
    },
    { 
      icon: Clock, 
      label: "Time Saved", 
      value: data.timeSaved,
      gradient: "from-orange-500 to-amber-600",
      glow: "shadow-orange-500/20"
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", duration: 0.6 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg"
        >
          <GlassCard className="p-8 relative overflow-hidden">
            {/* Sunrise gradient background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div 
                className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, rgba(251,146,60,0.1) 40%, transparent 70%)"
                }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div 
                className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Sparkle particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary/40"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              ))}
            </div>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 hover:scale-105 z-10"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-8 relative">
              <motion.div 
                className="relative"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-amber-500/20">
                  <Sunrise className="h-7 w-7 text-amber-500" />
                </div>
                <motion.div
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 blur-lg"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <div>
                <h2 className="text-2xl font-display font-medium text-foreground">Good Morning</h2>
                <p className="text-sm text-muted-foreground">Here's what happened while you slept</p>
              </div>
            </div>

            {/* Main earning display */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative text-center py-8 mb-8 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 border border-primary/20 overflow-hidden"
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />
              
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Bot className="h-4 w-4 text-secondary" />
                  <p className="text-sm text-muted-foreground">Earned autonomously</p>
                </div>
                <motion.p 
                  className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary"
                  animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ backgroundSize: "200%" }}
                >
                  ${animatedEarnings.toFixed(2)}
                </motion.p>
                <div className="flex items-center justify-center gap-1 mt-3 text-secondary">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">+12% vs yesterday</span>
                </div>
              </div>
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`relative p-5 rounded-2xl bg-foreground/5 border border-foreground/5 overflow-hidden group hover:bg-foreground/8 transition-all duration-300 shadow-lg ${stat.glow}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${stat.gradient} mb-3 shadow-lg`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Activity timeline */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <p className="text-xs font-medium text-muted-foreground mb-4 flex items-center gap-2">
                <Zap className="h-3 w-3" />
                OVERNIGHT ACTIVITY
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {activities.map((activity, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5 group hover:bg-foreground/8 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${activity.status === 'protected' ? 'bg-violet-500/20' : 'bg-secondary/20'}`}>
                      <activity.icon className={`h-3.5 w-3.5 ${activity.status === 'protected' ? 'text-violet-400' : 'text-secondary'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{activity.label}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-all duration-200 text-sm font-medium text-foreground"
              >
                <Share2 className="h-4 w-4" />
                Share Receipt
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-200 text-sm font-medium text-white shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Start Your Day
              </motion.button>
            </div>

            {/* Footer */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-3 w-3 text-secondary" />
              Everything important has been handled
            </motion.p>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
