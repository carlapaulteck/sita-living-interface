import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { 
  Activity,
  MessageSquare,
  DollarSign,
  Calendar,
  Users,
  ShoppingCart,
  Bell,
  Zap,
  Check,
  AlertTriangle,
  TrendingUp,
  Mail,
  Star
} from "lucide-react";
import { DemoEvent, eventTypeLabels, eventTypeIcons } from "@/lib/eventStore";

interface LiveEventFeedProps {
  events?: DemoEvent[];
  maxEvents?: number;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  DollarSign,
  Calendar,
  Users,
  ShoppingCart,
  Bell,
  Zap,
  Check,
  AlertTriangle,
  TrendingUp,
  Mail,
  Star,
  Activity
};

export function LiveEventFeed({ 
  events = [], 
  maxEvents = 8,
  className = "" 
}: LiveEventFeedProps) {
  const [displayedEvents, setDisplayedEvents] = useState<DemoEvent[]>([]);
  const [newEventId, setNewEventId] = useState<string | null>(null);

  useEffect(() => {
    // Only show the most recent events
    const sortedEvents = [...events]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, maxEvents);
    
    // Check if there's a new event
    if (sortedEvents.length > displayedEvents.length && displayedEvents.length > 0) {
      const newestEvent = sortedEvents[0];
      setNewEventId(newestEvent.refId);
      setTimeout(() => setNewEventId(null), 2000);
    }
    
    setDisplayedEvents(sortedEvents);
  }, [events, maxEvents]);

  const getEventIcon = (type: string) => {
    const iconName = eventTypeIcons[type as keyof typeof eventTypeIcons] || "Activity";
    // Map emoji to icon component
    const iconMapping: Record<string, React.ComponentType<{ className?: string }>> = {
      "👤": Users,
      "✅": Check,
      "🎉": Star,
      "❌": AlertTriangle,
      "📨": Mail,
      "📤": MessageSquare,
      "🚨": AlertTriangle,
      "💬": MessageSquare,
      "🛒": ShoppingCart,
      "💰": DollarSign,
      "🛍️": ShoppingCart,
      "📦": ShoppingCart,
      "📄": DollarSign,
      "📧": Mail,
      "💵": DollarSign,
      "✨": Zap,
      "📅": Calendar,
      "✔️": Check,
      "🏁": Check,
      "🚀": TrendingUp,
      "⏸️": Activity,
      "🧪": Zap,
      "📈": TrendingUp,
      "🔴": AlertTriangle,
      "⚡": Zap,
      "📱": Activity,
      "⭐": Star,
      "🔌": Activity,
      "📌": Activity
    };
    return iconMapping[iconName] || Activity;
  };

  const getEventColor = (type: string): string => {
    if (type.includes("order") || type.includes("payment")) return "text-secondary";
    if (type.includes("lead") || type.includes("dm")) return "text-primary";
    if (type.includes("risk") || type.includes("alert")) return "text-destructive";
    if (type.includes("calendar") || type.includes("flow")) return "text-accent";
    return "text-muted-foreground";
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (displayedEvents.length === 0) {
    return (
      <GlassCard className={`p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/20">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Live Activity</h3>
            <p className="text-xs text-muted-foreground">Real-time system events</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mb-3">
            <Zap className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No recent activity</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Events will appear here as they happen</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Live Activity</h3>
            <p className="text-xs text-muted-foreground">Real-time system events</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {displayedEvents.map((event, index) => {
            const IconComponent = getEventIcon(event.type);
            const isNew = event.refId === newEventId;
            
            return (
              <motion.div
                key={`${event.refId}-${event.timestamp}`}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isNew 
                    ? "bg-primary/10 border border-primary/30" 
                    : "bg-foreground/5 hover:bg-foreground/10"
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  isNew ? "bg-primary/20" : "bg-foreground/5"
                }`}>
                  <IconComponent className={`h-4 w-4 ${getEventColor(event.type)}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {eventTypeLabels[event.type as keyof typeof eventTypeLabels] || event.type.replace(/[._]/g, " ")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {event.refId}
                  </p>
                </div>
                
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">
                    {formatTime(event.timestamp)}
                  </p>
                  {isNew && (
                    <span className="text-xs text-primary font-medium">New</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {events.length > maxEvents && (
        <div className="mt-4 text-center">
          <button className="text-xs text-primary hover:underline">
            View all {events.length} events
          </button>
        </div>
      )}
    </GlassCard>
  );
}