import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/GlassCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  Search,
  ChevronRight,
  Brain,
  Calendar,
  Target,
  Heart,
  BarChart3,
  Shield,
  Bell,
  Settings,
  Zap,
  Sparkles,
  HelpCircle,
  BookOpen,
  Lightbulb,
  Users,
  Database,
  Sunrise,
} from "lucide-react";

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  icon: any;
  content: string;
  tags: string[];
}

const helpArticles: HelpArticle[] = [
  {
    id: "cognitive-budget",
    title: "Understanding Cognitive Budget",
    category: "Core Features",
    icon: Brain,
    content: "Your cognitive budget represents your mental energy throughout the day. SITA tracks how activities affect your energy levels and helps you optimize your schedule. The budget resets each morning based on your sleep quality and other factors.",
    tags: ["energy", "budget", "cognitive", "mental"],
  },
  {
    id: "calendar-sync",
    title: "Calendar Synchronization",
    category: "Core Features",
    icon: Calendar,
    content: "Connect your calendar to SITA to get intelligent scheduling suggestions. SITA analyzes your cognitive patterns to recommend optimal times for different types of tasks - deep work, meetings, creative tasks, and breaks.",
    tags: ["calendar", "schedule", "sync", "events"],
  },
  {
    id: "habit-tracking",
    title: "Habit Tracking & Streaks",
    category: "Core Features",
    icon: Target,
    content: "Build sustainable habits with SITA's intelligent tracking. Set daily habits, track your streaks, and receive smart reminders timed to your cognitive peaks. SITA adjusts reminder timing based on your current mental state.",
    tags: ["habits", "streak", "tracking", "goals"],
  },
  {
    id: "recovery-mode",
    title: "Recovery Mode",
    category: "Wellness",
    icon: Heart,
    content: "When you're feeling overwhelmed or stressed, activate Recovery Mode. SITA will reduce notifications, suggest calming activities, and help you restore your cognitive energy. It can also activate automatically when overload is detected.",
    tags: ["recovery", "stress", "wellness", "rest"],
  },
  {
    id: "weekly-insights",
    title: "Weekly Insights & Patterns",
    category: "Analytics",
    icon: BarChart3,
    content: "Every week, SITA analyzes your patterns and provides actionable insights. Learn about your most productive times, habit consistency, and cognitive trends. Use these insights to optimize your routines.",
    tags: ["insights", "analytics", "patterns", "weekly"],
  },
  {
    id: "morning-briefing",
    title: "Morning Briefing",
    category: "Daily Rituals",
    icon: Sunrise,
    content: "Start your day with a personalized morning briefing. SITA summarizes your schedule, pending tasks, and provides energy forecasts. The briefing adapts based on your sleep data and upcoming commitments.",
    tags: ["morning", "briefing", "daily", "ritual"],
  },
  {
    id: "notifications",
    title: "Smart Notification Batching",
    category: "Productivity",
    icon: Bell,
    content: "SITA batches your notifications intelligently based on your cognitive state. During focus periods, non-urgent notifications are held and delivered during natural break times.",
    tags: ["notifications", "batching", "focus", "interruptions"],
  },
  {
    id: "energy-forecast",
    title: "Energy Forecast",
    category: "Analytics",
    icon: Zap,
    content: "SITA predicts your energy levels throughout the day based on historical patterns, sleep data, and scheduled activities. Use this forecast to plan demanding tasks during peak energy windows.",
    tags: ["energy", "forecast", "prediction", "planning"],
  },
  {
    id: "admin-users",
    title: "User Management (Admin)",
    category: "Administration",
    icon: Users,
    content: "Administrators can view and manage all platform users. Assign roles (Admin, Moderator, User), search for specific users, and monitor activity. Role changes take effect immediately.",
    tags: ["admin", "users", "roles", "management"],
  },
  {
    id: "admin-health",
    title: "System Health (Admin)",
    category: "Administration",
    icon: Database,
    content: "Monitor the health of all platform services including database, authentication, and realtime connections. Green indicates healthy, yellow degraded, and red indicates issues requiring attention.",
    tags: ["admin", "health", "system", "monitoring"],
  },
  {
    id: "privacy",
    title: "Privacy & Data Sovereignty",
    category: "Security",
    icon: Shield,
    content: "SITA is designed with privacy-first principles. Your data stays under your control. Configure what SITA can access, set boundaries, and export or delete your data at any time from Settings.",
    tags: ["privacy", "security", "data", "sovereignty"],
  },
  {
    id: "settings",
    title: "Personalizing SITA",
    category: "Getting Started",
    icon: Settings,
    content: "Customize SITA to match your preferences. Adjust cognitive profile settings, notification preferences, theme, and integration connections. SITA adapts to your unique cognitive style.",
    tags: ["settings", "personalization", "customize", "preferences"],
  },
];

interface HelpGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpGuide({ isOpen, onClose }: HelpGuideProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);

  useEffect(() => {
    const handleOpenHelp = () => {
      // This is handled by parent component
    };
    document.addEventListener("openHelpGuide", handleOpenHelp);
    return () => document.removeEventListener("openHelpGuide", handleOpenHelp);
  }, []);

  const filteredArticles = helpArticles.filter((article) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(searchLower) ||
      article.category.toLowerCase().includes(searchLower) ||
      article.tags.some((tag) => tag.includes(searchLower))
    );
  });

  const categories = [...new Set(helpArticles.map((a) => a.category))];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[80vh]"
        >
          <GlassCard className="p-0 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-display font-semibold text-foreground">
                    Help Guide
                  </h2>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="h-[60vh]">
              {selectedArticle ? (
                <div className="p-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedArticle(null)}
                    className="mb-4 -ml-2"
                  >
                    ← Back to articles
                  </Button>

                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <selectedArticle.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground">
                        {selectedArticle.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedArticle.category}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedArticle.content}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-6">
                    {selectedArticle.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-foreground/5 text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  {searchQuery ? (
                    <div className="space-y-2">
                      {filteredArticles.length === 0 ? (
                        <div className="text-center py-8">
                          <HelpCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No articles found for "{searchQuery}"
                          </p>
                        </div>
                      ) : (
                        filteredArticles.map((article) => (
                          <ArticleCard
                            key={article.id}
                            article={article}
                            onClick={() => setSelectedArticle(article)}
                          />
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Quick Tips */}
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">
                            Quick Tip
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Press <kbd className="px-1.5 py-0.5 rounded bg-foreground/10 font-mono">⌘ K</kbd> anywhere to open the command bar for quick navigation.
                        </p>
                      </div>

                      {/* Categories */}
                      {categories.map((category) => (
                        <div key={category}>
                          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                            {category}
                          </h3>
                          <div className="space-y-1">
                            {helpArticles
                              .filter((a) => a.category === category)
                              .map((article) => (
                                <ArticleCard
                                  key={article.id}
                                  article={article}
                                  onClick={() => setSelectedArticle(article)}
                                />
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ArticleCard({
  article,
  onClick,
}: {
  article: HelpArticle;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-foreground/5 transition-colors text-left group"
    >
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <article.icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {article.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {article.content.substring(0, 60)}...
        </p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
    </button>
  );
}
