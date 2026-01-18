import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ContextualTooltipProps {
  children: React.ReactNode;
  content: string;
  description?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
  delayDuration?: number;
}

export function ContextualTooltip({
  children,
  content,
  description,
  side = "top",
  align = "center",
  className,
  delayDuration = 200,
}: ContextualTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn(
            "max-w-xs bg-popover/95 backdrop-blur-xl border border-border/50 shadow-xl",
            className
          )}
        >
          <div className="space-y-1">
            <p className="font-medium text-sm text-foreground">{content}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Pre-built contextual tooltips for common features
export const tooltipContent = {
  calendar: {
    content: "Calendar",
    description: "View and manage your schedule, events, and focus blocks",
  },
  habits: {
    content: "Habits",
    description: "Track daily habits and view your streaks",
  },
  notifications: {
    content: "Smart Notifications",
    description: "AI-batched notifications optimized for your cognitive state",
  },
  recovery: {
    content: "Recovery Mode",
    description: "Take a break with guided relaxation and reduced stimuli",
  },
  insights: {
    content: "Weekly Insights",
    description: "Patterns, trends, and personalized recommendations",
  },
  briefing: {
    content: "Morning Briefing",
    description: "Your personalized daily overview and priorities",
  },
  wakeUpReceipt: {
    content: "Wake-Up Receipt",
    description: "Summary of overnight activity and morning readiness",
  },
  cognitiveBudget: {
    content: "Cognitive Budget",
    description: "Track and manage your mental energy throughout the day",
  },
  trustControls: {
    content: "Trust Controls",
    description: "Manage AI autonomy levels and safety boundaries",
  },
  warRoom: {
    content: "War Room",
    description: "Full system overview and critical operations",
  },
  help: {
    content: "Help & Guides",
    description: "Browse help articles and feature documentation",
  },
  dnd: {
    content: "Do Not Disturb",
    description: "Pause all non-critical notifications and interruptions",
  },
};
