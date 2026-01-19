import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  parseISO
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  Users,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ExternalLink,
  Bell,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/GlassCard";
import { useAcademy } from "@/hooks/useAcademy";
import { CommunityEvent } from "@/types/academy";
import { cn } from "@/lib/utils";

const eventTypeIcons: Record<string, typeof Video> = {
  livestream: Video,
  zoom: Users,
  workshop: CalendarIcon,
};

const eventTypeColors: Record<string, string> = {
  livestream: "bg-red-500/20 text-red-400 border-red-500/30",
  zoom: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  workshop: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export const EventsCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { events, profile, rsvpToEvent } = useAcademy();
  const isAdmin = profile?.is_admin || false;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get events for each day
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CommunityEvent[]>();
    events.forEach(event => {
      const dateKey = format(parseISO(event.start_time), 'yyyy-MM-dd');
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, event]);
    });
    return map;
  }, [events]);

  // Get upcoming events
  const upcomingEvents = events
    .filter(e => new Date(e.start_time) >= new Date())
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 5);

  // Events for selected date
  const selectedDateEvents = selectedDate 
    ? eventsByDate.get(format(selectedDate, 'yyyy-MM-dd')) || []
    : [];

  const handleRSVP = async (eventId: string) => {
    await rsvpToEvent.mutateAsync({ eventId, status: 'attending' });
  };

  const getCountdown = (startTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start.getTime() - now.getTime();
    
    if (diff <= 0) return "Live Now!";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const EventCard = ({ event }: { event: CommunityEvent }) => {
    const Icon = eventTypeIcons[event.event_type] || CalendarIcon;
    const startTime = new Date(event.start_time);
    const isLive = startTime <= new Date() && new Date(event.end_time) >= new Date();
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
      >
        <GlassCard hover className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                eventTypeColors[event.event_type] || eventTypeColors.workshop
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{event.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {format(startTime, 'MMM d, yyyy • h:mm a')}
                </p>
              </div>
            </div>
            {isLive && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                LIVE
              </Badge>
            )}
          </div>

          {event.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{getCountdown(event.start_time)}</span>
            </div>
            <Badge variant="outline" className={cn("capitalize", eventTypeColors[event.event_type])}>
              {event.event_type}
            </Badge>
          </div>

          <div className="flex gap-2">
            {event.meeting_url && (
              <Button
                asChild
                variant={isLive ? "default" : "outline"}
                size="sm"
                className={cn(
                  "flex-1",
                  isLive && "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                )}
              >
                <a href={event.meeting_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {isLive ? "Join Now" : "Meeting Link"}
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRSVP(event.id)}
              disabled={rsvpToEvent.isPending}
            >
              <Bell className="w-4 h-4 mr-2" />
              RSVP
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Calendar</h2>
          <p className="text-sm text-muted-foreground">
            {upcomingEvents.length} upcoming events
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <GlassCard hover={false}>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h3 className="text-lg font-semibold text-foreground">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month start */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-start-${i}`} className="aspect-square" />
              ))}
              
              {monthDays.map((day) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const dayEvents = eventsByDate.get(dateKey) || [];
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                
                return (
                  <motion.button
                    key={dateKey}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all",
                      isToday(day) && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                      isSelected
                        ? "bg-primary/20 border border-primary/30"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-medium",
                      isToday(day) ? "text-primary" : "text-foreground"
                    )}>
                      {format(day, 'd')}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-1">
                        {dayEvents.slice(0, 3).map((event, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              event.event_type === 'livestream' ? "bg-red-400" :
                              event.event_type === 'zoom' ? "bg-blue-400" : "bg-purple-400"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>

          {/* Selected Date Events */}
          <AnimatePresence>
            {selectedDate && selectedDateEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-4 space-y-4"
              >
                <h4 className="font-semibold text-foreground">
                  Events on {format(selectedDate, 'MMMM d, yyyy')}
                </h4>
                {selectedDateEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Upcoming Events</h4>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <GlassCard hover={false}>
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No upcoming events</p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
