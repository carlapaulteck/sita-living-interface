import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { 
  X, 
  Bell, 
  Check, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Zap,
  MessageSquare,
  Clock,
  Trash2
} from "lucide-react";

export interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "revenue" | "experiment" | "message";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

const iconMap = {
  success: Check,
  warning: AlertTriangle,
  info: Bell,
  revenue: DollarSign,
  experiment: Zap,
  message: MessageSquare,
};

const colorMap = {
  success: "text-secondary bg-secondary/10",
  warning: "text-primary bg-primary/10",
  info: "text-muted-foreground bg-foreground/5",
  revenue: "text-primary bg-primary/10",
  experiment: "text-secondary bg-secondary/10",
  message: "text-foreground bg-foreground/10",
};

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onClearAll,
}: NotificationCenterProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-medium text-foreground">Notifications</h2>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <>
                <button
                  onClick={onMarkAllAsRead}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-foreground/5 transition-colors"
                >
                  Mark all read
                </button>
                <button
                  onClick={onClearAll}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-foreground/5 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-border/50 hover:bg-foreground/5 transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="overflow-y-auto h-[calc(100%-80px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No notifications yet</p>
              <p className="text-sm text-muted-foreground/70">
                We'll let you know when something important happens
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              <AnimatePresence>
                {notifications.map((notification) => {
                  const Icon = iconMap[notification.type];
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`p-4 transition-colors ${
                        notification.read ? "bg-transparent" : "bg-foreground/[0.02]"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            colorMap[notification.type]
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-foreground">
                                {notification.title}
                                {!notification.read && (
                                  <span className="ml-2 w-2 h-2 rounded-full bg-primary inline-block" />
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {notification.message}
                              </p>
                            </div>
                            <button
                              onClick={() => onDismiss(notification.id)}
                              className="p-1 rounded hover:bg-foreground/5 transition-colors shrink-0"
                            >
                              <X className="h-3 w-3 text-muted-foreground" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(notification.timestamp)}
                            </span>
                            {notification.action && (
                              <button
                                onClick={() => {
                                  notification.action?.onClick();
                                  onMarkAsRead(notification.id);
                                }}
                                className="text-xs text-primary hover:underline"
                              >
                                {notification.action.label}
                              </button>
                            )}
                            {!notification.read && (
                              <button
                                onClick={() => onMarkAsRead(notification.id)}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
