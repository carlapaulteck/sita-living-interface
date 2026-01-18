import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, AlertTriangle, Info, Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string | null;
  starts_at: string | null;
  expires_at: string | null;
}

const typeConfig = {
  info: {
    icon: Info,
    bg: "bg-blue-500/10 border-blue-500/30",
    iconColor: "text-blue-400",
    textColor: "text-blue-100",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-500/10 border-amber-500/30",
    iconColor: "text-amber-400",
    textColor: "text-amber-100",
  },
  critical: {
    icon: AlertCircle,
    bg: "bg-red-500/10 border-red-500/30",
    iconColor: "text-red-400",
    textColor: "text-red-100",
  },
  update: {
    icon: Megaphone,
    bg: "bg-emerald-500/10 border-emerald-500/30",
    iconColor: "text-emerald-400",
    textColor: "text-emerald-100",
  },
};

export const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    // Load dismissed announcements from localStorage
    const dismissed = localStorage.getItem("dismissed_announcements");
    if (dismissed) {
      setDismissedIds(new Set(JSON.parse(dismissed)));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchAnnouncements = async () => {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from("admin_announcements")
        .select("id, title, content, type, starts_at, expires_at")
        .eq("is_active", true)
        .lte("starts_at", now)
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setAnnouncements(data);
      }
    };

    fetchAnnouncements();

    // Subscribe to changes
    const channel = supabase
      .channel("announcements")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "admin_announcements" },
        () => fetchAnnouncements()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleDismiss = (id: string) => {
    const newDismissed = new Set(dismissedIds);
    newDismissed.add(id);
    setDismissedIds(newDismissed);
    localStorage.setItem(
      "dismissed_announcements",
      JSON.stringify(Array.from(newDismissed))
    );
  };

  const visibleAnnouncements = announcements.filter(
    (a) => !dismissedIds.has(a.id)
  );

  if (visibleAnnouncements.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      <AnimatePresence>
        {visibleAnnouncements.map((announcement) => {
          const config = typeConfig[announcement.type as keyof typeof typeConfig] || typeConfig.info;
          const Icon = config.icon;

          return (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className={`relative rounded-lg border px-4 py-3 ${config.bg}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm ${config.textColor}`}>
                    {announcement.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {announcement.content}
                  </p>
                </div>
                <button
                  onClick={() => handleDismiss(announcement.id)}
                  className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                  aria-label="Dismiss announcement"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
