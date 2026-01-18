import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar,
  Plus,
  Clock,
  MapPin,
  Users,
  Target,
  X,
  ChevronLeft,
  ChevronRight,
  Video,
  Focus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GlassCard } from "@/components/GlassCard";
import { useCalendarEvents, CreateEventInput } from "@/hooks/useCalendarEvents";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";

interface CalendarSyncProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalendarSync({ isOpen, onClose }: CalendarSyncProps) {
  const { 
    events, 
    isLoading, 
    createEvent, 
    deleteEvent,
    getTodayEvents,
    getCurrentEventStatus 
  } = useCalendarEvents();
  
  const [view, setView] = useState<"week" | "list">("week");
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [newEvent, setNewEvent] = useState<Partial<CreateEventInput>>({
    title: "",
    start_time: "",
    end_time: "",
    is_focus_block: false,
    is_meeting: false,
  });
  
  const today = new Date();
  const weekStart = startOfWeek(addDays(today, weekOffset * 7), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const todayEvents = getTodayEvents();
  const currentStatus = getCurrentEventStatus();
  
  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.start_time || !newEvent.end_time) return;
    
    await createEvent(newEvent as CreateEventInput);
    setNewEvent({
      title: "",
      start_time: "",
      end_time: "",
      is_focus_block: false,
      is_meeting: false,
    });
    setShowAddEvent(false);
  };
  
  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.start_time);
      return isSameDay(eventDate, date);
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-medium text-foreground flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Calendar
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your schedule and focus blocks
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddEvent(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Current Status */}
          {currentStatus.isInEvent && currentStatus.currentEvent && (
            <GlassCard className="p-4 mb-4 border-primary/30">
              <div className="flex items-center gap-3">
                {currentStatus.isInFocusBlock ? (
                  <Focus className="h-5 w-5 text-primary" />
                ) : currentStatus.isInMeeting ? (
                  <Video className="h-5 w-5 text-accent" />
                ) : (
                  <Calendar className="h-5 w-5 text-primary" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Currently: {currentStatus.currentEvent.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Until {format(parseISO(currentStatus.currentEvent.end_time), "h:mm a")}
                  </p>
                </div>
              </div>
            </GlassCard>
          )}
          
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setWeekOffset(prev => prev - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[160px] text-center">
                {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setWeekOffset(prev => prev + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setWeekOffset(0)}
              disabled={weekOffset === 0}
            >
              Today
            </Button>
          </div>
          
          {/* Week View */}
          <GlassCard className="p-4 mb-6">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, i) => {
                const dayEvents = getEventsForDay(day);
                const isToday = isSameDay(day, today);
                
                return (
                  <div key={i} className="text-center">
                    <div className={`text-xs font-medium mb-1 ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                      {format(day, "EEE")}
                    </div>
                    <div className={`text-lg font-semibold mb-2 w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                      isToday ? "bg-primary text-primary-foreground" : ""
                    }`}>
                      {format(day, "d")}
                    </div>
                    <div className="space-y-1 min-h-[80px]">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 ${
                            event.is_focus_block 
                              ? "bg-primary/20 text-primary" 
                              : event.is_meeting
                              ? "bg-accent/20 text-accent"
                              : "bg-foreground/10 text-foreground"
                          }`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
          
          {/* Today's Events */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Today's Schedule</h3>
            {todayEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events scheduled for today</p>
            ) : (
              <div className="space-y-2">
                {todayEvents.map(event => (
                  <GlassCard key={event.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {event.is_focus_block ? (
                          <Target className="h-4 w-4 text-primary" />
                        ) : event.is_meeting ? (
                          <Users className="h-4 w-4 text-accent" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(event.start_time), "h:mm a")} - {format(parseISO(event.end_time), "h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.location && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => deleteEvent(event.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
          
          {/* Add Event Modal */}
          <AnimatePresence>
            {showAddEvent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              >
                <GlassCard className="p-6 w-full max-w-md">
                  <h3 className="text-lg font-medium text-foreground mb-4">Add Event</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Event title"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start">Start Time</Label>
                        <Input
                          id="start"
                          type="datetime-local"
                          value={newEvent.start_time}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, start_time: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="end">End Time</Label>
                        <Input
                          id="end"
                          type="datetime-local"
                          value={newEvent.end_time}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, end_time: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location (optional)</Label>
                      <Input
                        id="location"
                        value={newEvent.location || ""}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Location"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="focus">Focus Block</Label>
                      <Switch
                        id="focus"
                        checked={newEvent.is_focus_block}
                        onCheckedChange={(checked) => setNewEvent(prev => ({ 
                          ...prev, 
                          is_focus_block: checked,
                          is_meeting: checked ? false : prev.is_meeting 
                        }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="meeting">Meeting</Label>
                      <Switch
                        id="meeting"
                        checked={newEvent.is_meeting}
                        onCheckedChange={(checked) => setNewEvent(prev => ({ 
                          ...prev, 
                          is_meeting: checked,
                          is_focus_block: checked ? false : prev.is_focus_block 
                        }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowAddEvent(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleCreateEvent}
                      disabled={!newEvent.title || !newEvent.start_time || !newEvent.end_time}
                    >
                      Add Event
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
