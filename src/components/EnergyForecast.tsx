import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  Zap,
  Sun,
  Sunset,
  Moon,
  Coffee,
  AlertTriangle,
  Sparkles,
  BatteryFull,
  BatteryMedium,
  BatteryLow
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format, addHours, startOfDay, isToday, isTomorrow } from "date-fns";

interface ForecastPoint {
  hour: number;
  energy: number;
  events: string[];
  load: "low" | "medium" | "high";
}

interface DayForecast {
  date: Date;
  points: ForecastPoint[];
  peakEnergy: number;
  lowEnergy: number;
  optimalWorkWindow: { start: number; end: number };
  warnings: string[];
}

export function EnergyForecast({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth();
  const [forecast, setForecast] = useState<DayForecast | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateForecast();
  }, [user?.id]);

  const generateForecast = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch calendar events for today
      const today = startOfDay(new Date());
      const tomorrow = addHours(today, 24);

      const { data: events } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", user.id)
        .gte("start_time", today.toISOString())
        .lt("start_time", tomorrow.toISOString());

      // Fetch historical patterns
      const { data: cognitiveHistory } = await supabase
        .from("cognitive_states")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);

      // Generate hourly forecast
      const points: ForecastPoint[] = [];
      const currentHour = new Date().getHours();
      
      for (let hour = 6; hour <= 22; hour++) {
        // Base energy follows circadian rhythm
        let baseEnergy = getCircadianEnergy(hour);
        
        // Adjust based on calendar load
        const hourEvents = events?.filter(e => {
          const eventHour = new Date(e.start_time).getHours();
          return eventHour === hour;
        }) || [];

        const eventNames = hourEvents.map(e => e.title);
        
        // Meetings drain energy
        const meetingCount = hourEvents.filter(e => e.is_meeting).length;
        baseEnergy -= meetingCount * 10;

        // Focus blocks preserve energy
        const focusBlocks = hourEvents.filter(e => e.is_focus_block).length;
        baseEnergy += focusBlocks * 5;

        // Historical pattern adjustment
        if (cognitiveHistory && cognitiveHistory.length > 0) {
          const hourlyPatterns = cognitiveHistory.filter(h => {
            const historyHour = new Date(h.created_at!).getHours();
            return historyHour === hour;
          });
          
          if (hourlyPatterns.length > 0) {
            const avgHistoricalEnergy = hourlyPatterns.reduce((sum, p) => sum + (p.cognitive_budget || 0.7), 0) / hourlyPatterns.length;
            baseEnergy = (baseEnergy + avgHistoricalEnergy * 100) / 2;
          }
        }

        // Clamp energy between 0-100
        baseEnergy = Math.max(0, Math.min(100, baseEnergy));

        // Determine load level
        let load: "low" | "medium" | "high" = "low";
        if (hourEvents.length > 2 || meetingCount > 1) load = "high";
        else if (hourEvents.length > 0) load = "medium";

        points.push({
          hour,
          energy: Math.round(baseEnergy),
          events: eventNames,
          load,
        });
      }

      // Calculate summary metrics
      const energies = points.map(p => p.energy);
      const peakEnergy = Math.max(...energies);
      const lowEnergy = Math.min(...energies);

      // Find optimal work window (3+ hours of high energy)
      let bestWindowStart = 9;
      let bestWindowEnd = 12;
      let bestWindowAvg = 0;

      for (let start = 6; start <= 19; start++) {
        const windowPoints = points.filter(p => p.hour >= start && p.hour < start + 3);
        if (windowPoints.length === 3) {
          const avg = windowPoints.reduce((sum, p) => sum + p.energy, 0) / 3;
          if (avg > bestWindowAvg) {
            bestWindowAvg = avg;
            bestWindowStart = start;
            bestWindowEnd = start + 3;
          }
        }
      }

      // Generate warnings
      const warnings: string[] = [];
      const highLoadHours = points.filter(p => p.load === "high");
      if (highLoadHours.length >= 4) {
        warnings.push("Heavy day ahead - consider rescheduling non-essential meetings");
      }
      
      const afternoonEnergy = points.filter(p => p.hour >= 14 && p.hour <= 16);
      if (afternoonEnergy.every(p => p.energy < 50)) {
        warnings.push("Energy dip predicted 2-4pm - schedule lighter work");
      }

      const eveningEvents = events?.filter(e => {
        const hour = new Date(e.start_time).getHours();
        return hour >= 18;
      });
      if (eveningEvents && eveningEvents.length > 2) {
        warnings.push("Busy evening - rest may be limited tonight");
      }

      setForecast({
        date: today,
        points,
        peakEnergy,
        lowEnergy,
        optimalWorkWindow: { start: bestWindowStart, end: bestWindowEnd },
        warnings,
      });
    } catch (error) {
      console.error("Error generating forecast:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCircadianEnergy = (hour: number): number => {
    // Natural energy curve throughout the day
    if (hour >= 6 && hour < 8) return 60 + (hour - 6) * 15; // Morning rise
    if (hour >= 8 && hour < 11) return 90; // Peak morning
    if (hour >= 11 && hour < 13) return 85; // Pre-lunch
    if (hour >= 13 && hour < 15) return 65; // Post-lunch dip
    if (hour >= 15 && hour < 17) return 75; // Afternoon recovery
    if (hour >= 17 && hour < 19) return 70; // Early evening
    if (hour >= 19 && hour < 21) return 55; // Evening wind-down
    return 40; // Night
  };

  const getTimeIcon = (hour: number) => {
    if (hour >= 6 && hour < 12) return <Sun className="h-3.5 w-3.5 text-amber-400" />;
    if (hour >= 12 && hour < 17) return <Coffee className="h-3.5 w-3.5 text-primary" />;
    if (hour >= 17 && hour < 20) return <Sunset className="h-3.5 w-3.5 text-orange-400" />;
    return <Moon className="h-3.5 w-3.5 text-secondary" />;
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 75) return "text-emerald-400";
    if (energy >= 50) return "text-amber-400";
    if (energy >= 25) return "text-orange-400";
    return "text-rose-400";
  };

  const getEnergyBarColor = (energy: number) => {
    if (energy >= 75) return "from-emerald-500 to-emerald-400";
    if (energy >= 50) return "from-amber-500 to-amber-400";
    if (energy >= 25) return "from-orange-500 to-orange-400";
    return "from-rose-500 to-rose-400";
  };

  if (isLoading) {
    return (
      <GlassCard className="p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-32 bg-foreground/10 rounded" />
          <div className="h-24 bg-foreground/5 rounded-xl" />
        </div>
      </GlassCard>
    );
  }

  if (compact) {
    const currentHour = new Date().getHours();
    const nextFewHours = forecast?.points.filter(p => p.hour >= currentHour && p.hour <= currentHour + 4) || [];
    
    return (
      <GlassCard className="p-5 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-4 relative">
          <Clock className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-medium text-foreground">Energy Forecast</h3>
        </div>

        {/* Mini Timeline */}
        <div className="flex items-end gap-1 h-16 mb-3">
          {nextFewHours.map((point, i) => (
            <motion.div
              key={point.hour}
              initial={{ height: 0 }}
              animate={{ height: `${point.energy}%` }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`flex-1 rounded-t bg-gradient-to-t ${getEnergyBarColor(point.energy)}`}
            />
          ))}
        </div>

        {/* Hour Labels */}
        <div className="flex gap-1 mb-4">
          {nextFewHours.map((point) => (
            <div key={point.hour} className="flex-1 text-center">
              <span className="text-[10px] text-muted-foreground">
                {point.hour > 12 ? point.hour - 12 : point.hour}{point.hour >= 12 ? 'p' : 'a'}
              </span>
            </div>
          ))}
        </div>

        {/* Optimal Window */}
        {forecast && (
          <div className="flex items-center gap-2 text-xs p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-foreground">
              Peak: {forecast.optimalWorkWindow.start > 12 ? forecast.optimalWorkWindow.start - 12 : forecast.optimalWorkWindow.start}
              {forecast.optimalWorkWindow.start >= 12 ? 'pm' : 'am'} - 
              {forecast.optimalWorkWindow.end > 12 ? forecast.optimalWorkWindow.end - 12 : forecast.optimalWorkWindow.end}
              {forecast.optimalWorkWindow.end >= 12 ? 'pm' : 'am'}
            </span>
          </div>
        )}
      </GlassCard>
    );
  }

  // Full view
  return (
    <GlassCard className="p-6 relative overflow-hidden">
      {/* Ambient glow */}
      <motion.div 
        className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(100,210,230,0.1) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-teal-400/10 border border-accent/20">
            <Calendar className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-display font-medium text-foreground">Daily Energy Forecast</h3>
            <p className="text-sm text-muted-foreground">
              {isToday(forecast?.date || new Date()) ? "Today" : 
               isTomorrow(forecast?.date || new Date()) ? "Tomorrow" : 
               format(forecast?.date || new Date(), "MMM d")}
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-1 text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-sm font-medium">{forecast?.peakEnergy}%</span>
            </div>
            <span className="text-xs text-muted-foreground">Peak</span>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-rose-400">
              <TrendingDown className="h-3.5 w-3.5" />
              <span className="text-sm font-medium">{forecast?.lowEnergy}%</span>
            </div>
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
        </div>
      </div>

      {/* Energy Timeline Chart */}
      <div className="relative mb-6">
        <div className="flex items-end gap-1 h-32">
          {forecast?.points.map((point, i) => {
            const currentHour = new Date().getHours();
            const isPast = point.hour < currentHour;
            const isCurrent = point.hour === currentHour;
            
            return (
              <motion.div
                key={point.hour}
                initial={{ height: 0 }}
                animate={{ height: `${point.energy}%` }}
                transition={{ delay: i * 0.03, duration: 0.5, ease: "easeOut" }}
                className={`
                  flex-1 rounded-t-sm relative group cursor-pointer
                  ${isPast ? "bg-foreground/20" : `bg-gradient-to-t ${getEnergyBarColor(point.energy)}`}
                  ${isCurrent ? "ring-2 ring-offset-2 ring-offset-background ring-secondary" : ""}
                `}
              >
                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-foreground/90 text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                    {point.hour > 12 ? point.hour - 12 : point.hour}:00{point.hour >= 12 ? 'pm' : 'am'} - {point.energy}%
                    {point.events.length > 0 && (
                      <div className="text-background/70 mt-0.5">{point.events.join(", ")}</div>
                    )}
                  </div>
                </div>

                {/* Load indicator */}
                {point.load === "high" && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-rose-400" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Hour labels */}
        <div className="flex gap-1 mt-2">
          {forecast?.points.filter((_, i) => i % 2 === 0).map((point) => (
            <div key={point.hour} className="flex-[2] text-center">
              <span className="text-[10px] text-muted-foreground">
                {point.hour > 12 ? point.hour - 12 : point.hour}{point.hour >= 12 ? 'p' : 'a'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Optimal Work Window */}
      {forecast && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 mb-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/20">
              <Sparkles className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground">Optimal Deep Work Window</h4>
              <p className="text-xs text-muted-foreground">
                Your best focus time today is{" "}
                <span className="text-emerald-400 font-medium">
                  {forecast.optimalWorkWindow.start > 12 ? forecast.optimalWorkWindow.start - 12 : forecast.optimalWorkWindow.start}:00
                  {forecast.optimalWorkWindow.start >= 12 ? 'pm' : 'am'} - {" "}
                  {forecast.optimalWorkWindow.end > 12 ? forecast.optimalWorkWindow.end - 12 : forecast.optimalWorkWindow.end}:00
                  {forecast.optimalWorkWindow.end >= 12 ? 'pm' : 'am'}
                </span>
              </p>
            </div>
            <Zap className="h-5 w-5 text-emerald-400" />
          </div>
        </motion.div>
      )}

      {/* Warnings */}
      {forecast?.warnings && forecast.warnings.length > 0 && (
        <div className="space-y-2">
          {forecast.warnings.map((warning, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"
            >
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="text-sm text-foreground">{warning}</span>
            </motion.div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
