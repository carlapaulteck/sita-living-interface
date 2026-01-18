import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { format, addDays, startOfWeek } from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  member: string;
  color: string;
}

const MOCK_EVENTS: CalendarEvent[] = [
  { id: "1", title: "School Play", time: "3:00 PM", member: "Emma", color: "bg-rose-500/20 border-rose-500/30 text-rose-300" },
  { id: "2", title: "Soccer Practice", time: "4:30 PM", member: "Alex Jr.", color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" },
  { id: "3", title: "Date Night", time: "7:00 PM", member: "Partner", color: "bg-primary/20 border-primary/30 text-primary" },
];

export function FamilyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <GlassCard className="p-4" hover={false}>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentDate(addDays(currentDate, -7))}
            className="p-2 rounded-lg hover:bg-card/50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <h3 className="text-lg font-display font-medium text-foreground">
            {format(weekStart, "MMMM yyyy")}
          </h3>
          <button
            onClick={() => setCurrentDate(addDays(currentDate, 7))}
            className="p-2 rounded-lg hover:bg-card/50 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                  isToday
                    ? "bg-primary/20 border border-primary/30"
                    : "hover:bg-card/50 border border-transparent"
                }`}
              >
                <span className="text-xs text-muted-foreground">{format(day, "EEE")}</span>
                <span className={`text-lg font-medium ${isToday ? "text-primary" : "text-foreground"}`}>
                  {format(day, "d")}
                </span>
              </motion.button>
            );
          })}
        </div>
      </GlassCard>

      {/* Today's Events */}
      <GlassCard className="p-6" hover={false}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-medium text-foreground">Today's Events</h3>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors">
            <Plus className="h-4 w-4" />
            Add Event
          </button>
        </div>

        <div className="space-y-3">
          {MOCK_EVENTS.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl border ${event.color}`}
            >
              <div className="w-1 h-10 rounded-full bg-current opacity-50" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{event.title}</p>
                <p className="text-sm text-muted-foreground">{event.time} • {event.member}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
