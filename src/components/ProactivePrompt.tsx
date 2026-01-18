import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Brain, 
  Calendar, 
  Coffee, 
  AlertTriangle,
  Target,
  Lightbulb,
  TrendingUp,
  X,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProactiveTriggerType } from '@/hooks/useProactiveConversation';

interface ProactivePromptProps {
  type: ProactiveTriggerType;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  onAccept: () => void;
  onDismiss: () => void;
  metadata?: Record<string, unknown>;
}

const triggerConfig: Record<ProactiveTriggerType, { 
  icon: React.ElementType; 
  color: string;
  bgColor: string;
  label: string;
}> = {
  morning_briefing: { 
    icon: Sun, 
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    label: 'Morning Briefing'
  },
  cognitive_state_change: { 
    icon: Brain, 
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    label: 'State Change'
  },
  calendar_reminder: { 
    icon: Calendar, 
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    label: 'Calendar'
  },
  idle_check_in: { 
    icon: Coffee, 
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    label: 'Check-in'
  },
  stress_alert: { 
    icon: AlertTriangle, 
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    label: 'Stress Alert'
  },
  focus_completion: { 
    icon: Target, 
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    label: 'Focus Complete'
  },
  pattern_detected: { 
    icon: Lightbulb, 
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    label: 'Pattern'
  },
  goal_progress: { 
    icon: TrendingUp, 
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    label: 'Goal Progress'
  },
};

export const ProactivePrompt: React.FC<ProactivePromptProps> = ({
  type,
  message,
  priority,
  onAccept,
  onDismiss,
}) => {
  const config = triggerConfig[type];
  const Icon = config.icon;

  const priorityStyles = {
    low: 'border-border/50',
    medium: 'border-primary/30',
    high: 'border-amber-400/50 shadow-amber-400/10',
    critical: 'border-red-400/50 shadow-red-400/20 animate-pulse',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={`
        relative rounded-2xl border backdrop-blur-xl
        bg-card/90 shadow-xl
        ${priorityStyles[priority]}
        overflow-hidden
      `}
    >
      {/* Glow effect for high priority */}
      {(priority === 'high' || priority === 'critical') && (
        <div className={`absolute inset-0 ${config.bgColor} opacity-20 blur-xl`} />
      )}

      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${config.bgColor}`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div>
              <span className={`text-xs font-medium ${config.color}`}>
                {config.label}
              </span>
              {priority === 'critical' && (
                <span className="ml-2 px-1.5 py-0.5 text-xs font-bold rounded bg-red-500/20 text-red-400">
                  URGENT
                </span>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Message */}
        <p className="text-sm text-foreground/90 leading-relaxed mb-4">
          {message}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onAccept}
            size="sm"
            className="gap-2 flex-1"
          >
            <Sparkles className="w-4 h-4" />
            Let's do it
            <ArrowRight className="w-3 h-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-muted-foreground"
          >
            Maybe later
          </Button>
        </div>
      </div>

      {/* Animated border for critical */}
      {priority === 'critical' && (
        <motion.div
          className="absolute inset-0 border-2 border-red-400/50 rounded-2xl pointer-events-none"
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );
};

// Container for multiple prompts
interface ProactivePromptStackProps {
  prompts: Array<{
    type: ProactiveTriggerType;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    timestamp: Date;
    metadata?: Record<string, unknown>;
  }>;
  onAccept: (timestamp: Date) => void;
  onDismiss: (timestamp: Date) => void;
}

export const ProactivePromptStack: React.FC<ProactivePromptStackProps> = ({
  prompts,
  onAccept,
  onDismiss,
}) => {
  // Only show top 3 prompts, prioritized
  const sortedPrompts = [...prompts]
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 3);

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col gap-3 max-w-sm">
      <AnimatePresence mode="popLayout">
        {sortedPrompts.map((prompt, index) => (
          <motion.div
            key={prompt.timestamp.getTime()}
            layout
            style={{ zIndex: 10 - index }}
          >
            <ProactivePrompt
              type={prompt.type}
              message={prompt.message}
              priority={prompt.priority}
              metadata={prompt.metadata}
              onAccept={() => onAccept(prompt.timestamp)}
              onDismiss={() => onDismiss(prompt.timestamp)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
