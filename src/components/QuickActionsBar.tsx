import { motion } from "framer-motion";
import {
  Calendar,
  CheckSquare,
  Bell,
  Moon,
  BarChart3,
  Sunrise,
  ShieldCheck,
  Map,
  BellOff,
} from "lucide-react";

interface QuickActionsBarProps {
  isDNDActive?: boolean;
  onCalendar: () => void;
  onHabits: () => void;
  onNotifications: () => void;
  onRecovery: () => void;
  onWeeklyInsights: () => void;
  onBriefing: () => void;
  onTrustControls: () => void;
  onWarRoom: () => void;
  onDND: () => void;
}

export function QuickActionsBar({
  isDNDActive,
  onCalendar,
  onHabits,
  onNotifications,
  onRecovery,
  onWeeklyInsights,
  onBriefing,
  onTrustControls,
  onWarRoom,
  onDND,
}: QuickActionsBarProps) {
  const actions = [
    {
      icon: Calendar,
      label: "Calendar",
      onClick: onCalendar,
      color: "text-[#00FFFF]",
      bgFrom: "[#00FFFF]",
      bgTo: "[#9370DB]",
      delay: 0.6,
    },
    {
      icon: CheckSquare,
      label: "Habits",
      onClick: onHabits,
      color: "text-[#9370DB]",
      bgFrom: "[#9370DB]",
      bgTo: "[#00FFFF]",
      delay: 0.7,
    },
    {
      icon: Bell,
      label: "Notifications",
      onClick: onNotifications,
      color: "text-[#FFD700]",
      bgFrom: "[#FFD700]",
      bgTo: "[#9370DB]",
      delay: 0.8,
    },
    {
      icon: isDNDActive ? BellOff : Moon,
      label: isDNDActive ? "DND Active" : "Recovery",
      onClick: isDNDActive ? onDND : onRecovery,
      color: isDNDActive ? "text-primary" : "text-[#00FFFF]",
      bgFrom: isDNDActive ? "primary" : "[#00FFFF]",
      bgTo: "[#9370DB]",
      delay: 0.9,
      isHighlighted: isDNDActive,
    },
    {
      icon: BarChart3,
      label: "Insights",
      onClick: onWeeklyInsights,
      color: "text-[#9370DB]",
      bgFrom: "[#9370DB]",
      bgTo: "[#00FFFF]",
      delay: 1.0,
    },
    {
      icon: Sunrise,
      label: "Briefing",
      onClick: onBriefing,
      color: "text-[#FFD700]",
      bgFrom: "[#FFD700]",
      bgTo: "[#9370DB]",
      delay: 1.1,
    },
    {
      icon: ShieldCheck,
      label: "Trust",
      onClick: onTrustControls,
      color: "text-secondary",
      bgFrom: "secondary",
      bgTo: "primary",
      delay: 1.2,
    },
    {
      icon: Map,
      label: "War Room",
      onClick: onWarRoom,
      color: "text-white/80",
      bgFrom: "white",
      bgTo: "white",
      delay: 1.3,
    },
  ];

  return (
    <div className="fixed bottom-28 md:bottom-24 right-4 flex flex-col gap-2 z-30">
      {actions.map((action) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: action.delay }}
          onClick={action.onClick}
          className={`group relative p-3 rounded-xl backdrop-blur-xl hover:scale-105 transition-all ${
            action.isHighlighted
              ? "bg-primary/20 border border-primary/30"
              : "bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10 hover:border-foreground/20"
          }`}
          title={action.label}
        >
          <action.icon className={`h-5 w-5 ${action.color}`} />
          
          {/* Tooltip */}
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {action.label}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
