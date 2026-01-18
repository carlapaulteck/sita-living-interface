import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  History,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Zap,
  ChevronDown,
  ChevronUp,
  Filter,
  TrendingUp,
  Activity,
  Moon,
  Brain,
  DollarSign,
  Settings,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { AutomationRun } from "@/types/automations";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

const STATUS_CONFIG = {
  success: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  partial: { icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-400/10" },
  failed: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
};

const CATEGORY_ICONS: Record<string, any> = {
  health: Moon,
  focus: Brain,
  wealth: DollarSign,
  system: Settings,
  default: Zap,
};

// Demo data for when no real data exists
const DEMO_RUNS: AutomationRun[] = [
  {
    id: "demo-1",
    user_id: "demo",
    automation_id: "sleep-recovery",
    automation_name: "Sleep Score Recovery",
    trigger_event: "Sleep score dropped to 65 (below 70 threshold)",
    actions_taken: [
      { type: "schedule", description: "Rescheduled morning meeting to 10am", result: "success" },
      { type: "notification", description: "Added wind-down reminder for 9pm" },
    ],
    status: "success",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    metadata: { category: "health", sleep_score: 65, threshold: 70 },
  },
  {
    id: "demo-2",
    user_id: "demo",
    automation_id: "focus-guard",
    automation_name: "Focus Window Guard",
    trigger_event: "Focus block started at 9:00 AM",
    actions_taken: [
      { type: "notification", description: "Silenced non-urgent notifications" },
      { type: "custom", description: "Opened task list for deep work session" },
    ],
    status: "success",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    metadata: { category: "focus", duration_minutes: 90 },
  },
  {
    id: "demo-3",
    user_id: "demo",
    automation_id: "stress-response",
    automation_name: "Stress Response",
    trigger_event: "Stress level elevated to 7.5/10",
    actions_taken: [
      { type: "wellness", description: "Initiated 4-7-8 breathing protocol" },
      { type: "schedule", description: "Attempted to reschedule 2pm meeting", result: "Could not reach calendar API" },
    ],
    status: "partial",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    metadata: { category: "health", stress_level: 7.5 },
  },
  {
    id: "demo-4",
    user_id: "demo",
    automation_id: "morning-briefing",
    automation_name: "Morning Briefing",
    trigger_event: "Wake time + 15 minutes (7:15 AM)",
    actions_taken: [
      { type: "notification", description: "Delivered personalized morning summary" },
    ],
    status: "success",
    created_at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    metadata: { category: "system" },
  },
];

export function AutomationHistoryLog() {
  const { user } = useAuth();
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedRun, setExpandedRun] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRuns() {
      if (!user) {
        setRuns(DEMO_RUNS);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("automation_runs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        
        // If no data, show demo data
        if (!data || data.length === 0) {
          setRuns(DEMO_RUNS);
        } else {
          setRuns(data.map(run => ({
            ...run,
            actions_taken: (run.actions_taken as unknown) as AutomationRun['actions_taken'],
            status: run.status as AutomationRun['status'],
            metadata: run.metadata as Record<string, any>,
          })));
        }
      } catch (error) {
        console.error("Error fetching automation runs:", error);
        setRuns(DEMO_RUNS);
      } finally {
        setLoading(false);
      }
    }

    fetchRuns();
  }, [user]);

  const filteredRuns = runs.filter((run) => {
    const matchesSearch =
      run.automation_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.trigger_event.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || run.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const todayRuns = runs.filter((r) => isToday(new Date(r.created_at)));
  const successRate = runs.length > 0
    ? Math.round((runs.filter((r) => r.status === "success").length / runs.length) * 100)
    : 100;
  const mostActive = runs.reduce((acc, run) => {
    acc[run.automation_name] = (acc[run.automation_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topAutomation = Object.entries(mostActive).sort((a, b) => b[1] - a[1])[0];

  const formatRunDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return `Today at ${format(date, "h:mm a")}`;
    if (isYesterday(date)) return `Yesterday at ${format(date, "h:mm a")}`;
    return format(date, "MMM d 'at' h:mm a");
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <History className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold text-foreground">
              Automation History
            </h2>
            <p className="text-xs text-muted-foreground">
              Track when automations triggered and what actions were taken
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-foreground/5 border border-border/50">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          <p className="text-xl font-semibold text-foreground">{todayRuns.length}</p>
          <p className="text-xs text-muted-foreground">runs</p>
        </div>
        <div className="p-3 rounded-xl bg-foreground/5 border border-border/50">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground">Success</span>
          </div>
          <p className="text-xl font-semibold text-foreground">{successRate}%</p>
          <p className="text-xs text-muted-foreground">rate</p>
        </div>
        <div className="p-3 rounded-xl bg-foreground/5 border border-border/50">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-secondary" />
            <span className="text-xs text-muted-foreground">Top</span>
          </div>
          <p className="text-sm font-medium text-foreground truncate">
            {topAutomation ? topAutomation[0].split(" ")[0] : "None"}
          </p>
          <p className="text-xs text-muted-foreground">
            {topAutomation ? `${topAutomation[1]}x` : "—"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search automations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Run List */}
      <ScrollArea className="h-[400px]">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-foreground/5 animate-pulse" />
            ))}
          </div>
        ) : filteredRuns.length === 0 ? (
          <div className="text-center py-12">
            <History className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No automation runs found</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Runs will appear here when your automations trigger
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredRuns.map((run, index) => {
                const StatusIcon = STATUS_CONFIG[run.status]?.icon || CheckCircle2;
                const category = run.metadata?.category || "default";
                const CategoryIcon = CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
                const isExpanded = expandedRun === run.id;

                return (
                  <motion.div
                    key={run.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isExpanded
                          ? "bg-foreground/5 border-primary/30"
                          : "bg-foreground/[0.02] border-border/50 hover:bg-foreground/5"
                      }`}
                      onClick={() => setExpandedRun(isExpanded ? null : run.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${STATUS_CONFIG[run.status]?.bg}`}
                        >
                          <StatusIcon
                            className={`h-4 w-4 ${STATUS_CONFIG[run.status]?.color}`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground truncate">
                              {run.automation_name}
                            </span>
                            <Badge variant="outline" className="text-[10px] px-1.5">
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {run.trigger_event}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              {formatRunDate(run.created_at)}
                            </p>
                            <p className="text-[10px] text-muted-foreground/70">
                              {run.actions_taken.length} action{run.actions_taken.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-border/50">
                              <p className="text-xs font-medium text-muted-foreground mb-2">
                                Actions Taken
                              </p>
                              <div className="space-y-2">
                                {run.actions_taken.map((action, i) => (
                                  <div
                                    key={i}
                                    className="flex items-start gap-2 p-2 rounded-lg bg-background/50"
                                  >
                                    <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-[10px] font-medium text-primary">
                                        {i + 1}
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs text-foreground">
                                        {action.description}
                                      </p>
                                      {action.result && action.result !== "success" && (
                                        <p className="text-[10px] text-amber-400 mt-0.5">
                                          Note: {action.result}
                                        </p>
                                      )}
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] capitalize"
                                    >
                                      {action.type}
                                    </Badge>
                                  </div>
                                ))}
                              </div>

                              {/* Metadata */}
                              {Object.keys(run.metadata || {}).length > 1 && (
                                <div className="mt-3 pt-3 border-t border-border/30">
                                  <p className="text-[10px] text-muted-foreground/70 mb-1">
                                    Context
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {Object.entries(run.metadata)
                                      .filter(([key]) => key !== "category")
                                      .map(([key, value]) => (
                                        <span
                                          key={key}
                                          className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/5 text-muted-foreground"
                                        >
                                          {key}: {String(value)}
                                        </span>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>
    </GlassCard>
  );
}
