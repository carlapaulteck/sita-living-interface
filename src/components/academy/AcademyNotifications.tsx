import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  MessageCircle, 
  Heart, 
  Trophy,
  BookOpen,
  Calendar,
  Check,
  CheckCheck
} from "lucide-react";
import { useAcademy } from "@/hooks/useAcademy";
import { cn } from "@/lib/utils";

const notificationIcons: Record<string, typeof Bell> = {
  comment: MessageCircle,
  like: Heart,
  level_up: Trophy,
  course_complete: BookOpen,
  event_reminder: Calendar,
};

const notificationColors: Record<string, string> = {
  comment: "bg-blue-500/20 text-blue-400",
  like: "bg-red-500/20 text-red-400",
  level_up: "bg-primary/20 text-primary",
  course_complete: "bg-green-500/20 text-green-400",
  event_reminder: "bg-purple-500/20 text-purple-400",
};

export const AcademyNotifications = () => {
  const [open, setOpen] = useState(false);
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAcademy();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkRead = async (notificationId: string) => {
    await markNotificationRead.mutateAsync(notificationId);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead.mutateAsync();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-xl bg-card/50 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </motion.button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-[380px] p-0 bg-card border-border"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h4 className="font-semibold text-foreground">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type] || Bell;
                const colorClass = notificationColors[notification.type] || "bg-muted text-muted-foreground";
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "p-4 hover:bg-muted/30 transition-colors cursor-pointer",
                      !notification.is_read && "bg-primary/5"
                    )}
                    onClick={() => !notification.is_read && handleMarkRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", colorClass)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{notification.title}</p>
                        {notification.message && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                            {notification.message}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
