import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/components/NotificationCenter";

// Demo notifications generator
const generateDemoNotifications = (): Notification[] => [
  {
    id: "n1",
    type: "revenue",
    title: "Revenue Recovered",
    message: "$1,240 recovered from dormant leads in the last 24 hours.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    action: {
      label: "View details",
      onClick: () => {},
    },
  },
  {
    id: "n2",
    type: "experiment",
    title: "Experiment Complete",
    message: "Email Subject Lines A/B test finished with +23% lift.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: false,
    action: {
      label: "See results",
      onClick: () => {},
    },
  },
  {
    id: "n3",
    type: "success",
    title: "Invoice Paid",
    message: "Jordan Lee paid invoice #1042 for $4,800.",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "n4",
    type: "message",
    title: "New Lead",
    message: "Sam Rivera inquired about trial classes via WhatsApp.",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: true,
    action: {
      label: "Open inbox",
      onClick: () => {},
    },
  },
  {
    id: "n5",
    type: "info",
    title: "System Update",
    message: "Workflow packs have been optimized for better performance.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Initialize with demo notifications
  useEffect(() => {
    setNotifications(generateDemoNotifications());
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `n${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications((prev) => [newNotification, ...prev]);
    
    // Show toast for new notifications
    toast({
      title: notification.title,
      description: notification.message,
    });
    
    return newNotification;
  }, [toast]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const openNotifications = useCallback(() => setIsOpen(true), []);
  const closeNotifications = useCallback(() => setIsOpen(false), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    isOpen,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismiss,
    clearAll,
    openNotifications,
    closeNotifications,
  };
}
