import React from 'react';
import { motion } from 'framer-motion';
import { 
  Inbox, Bell, FileText, Search, Calendar, 
  CheckCircle, MessageSquare, Users, FolderOpen,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type: 'notifications' | 'tasks' | 'data' | 'search' | 'calendar' | 'messages' | 'users' | 'files';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const emptyStateConfig = {
  notifications: {
    icon: Bell,
    defaultTitle: "You're all caught up!",
    defaultDescription: "No new notifications. We'll let you know when something important happens.",
    gradient: 'from-primary/20 to-purple-500/20',
  },
  tasks: {
    icon: CheckCircle,
    defaultTitle: "No tasks yet",
    defaultDescription: "Create your first task to start organizing your day.",
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  data: {
    icon: FolderOpen,
    defaultTitle: "No data available",
    defaultDescription: "This space is waiting for your first entry.",
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  search: {
    icon: Search,
    defaultTitle: "No results found",
    defaultDescription: "Try adjusting your search or filters to find what you're looking for.",
    gradient: 'from-orange-500/20 to-amber-500/20',
  },
  calendar: {
    icon: Calendar,
    defaultTitle: "No events scheduled",
    defaultDescription: "Your calendar is clear. Time to plan something?",
    gradient: 'from-violet-500/20 to-purple-500/20',
  },
  messages: {
    icon: MessageSquare,
    defaultTitle: "No messages",
    defaultDescription: "Start a conversation to see messages here.",
    gradient: 'from-pink-500/20 to-rose-500/20',
  },
  users: {
    icon: Users,
    defaultTitle: "No members yet",
    defaultDescription: "Invite people to collaborate and grow together.",
    gradient: 'from-teal-500/20 to-cyan-500/20',
  },
  files: {
    icon: FileText,
    defaultTitle: "No files uploaded",
    defaultDescription: "Upload files to access them from anywhere.",
    gradient: 'from-indigo-500/20 to-blue-500/20',
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  type, 
  title, 
  description, 
  action 
}) => {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      {/* Animated icon container */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className={`relative mb-6 p-6 rounded-full bg-gradient-to-br ${config.gradient}`}
      >
        <Icon className="h-12 w-12 text-muted-foreground" />
        
        {/* Sparkle decorations */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="h-4 w-4 text-primary/60" />
        </motion.div>
      </motion.div>

      {/* Text content */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-semibold text-foreground mb-2"
      >
        {title || config.defaultTitle}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-muted-foreground max-w-sm mb-6"
      >
        {description || config.defaultDescription}
      </motion.p>

      {/* Action button */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={action.onClick} variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
