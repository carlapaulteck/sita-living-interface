import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Moon, 
  Clock, 
  Calendar, 
  Brain, 
  Plus, 
  Trash2, 
  Bell,
  BellOff,
  Timer,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { Switch } from "@/components/ui/switch";
import { useDoNotDisturb, DNDSchedule } from "@/hooks/useDoNotDisturb";
import { useAdaptationSafe } from "@/contexts/AdaptationContext";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const QUICK_DND_OPTIONS = [
  { label: "30 min", duration: 30 },
  { label: "1 hour", duration: 60 },
  { label: "2 hours", duration: 120 },
  { label: "Until tomorrow", duration: 60 * 12 },
];

interface DoNotDisturbPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DoNotDisturbPanel({ isOpen, onClose }: DoNotDisturbPanelProps) {
  const {
    dndState,
    schedules,
    enableDND,
    disableDND,
    toggleDND,
    addSchedule,
    updateSchedule,
    removeSchedule,
    cognitiveAutoEnable,
    setCognitiveAutoEnable,
    calendarAutoEnable,
    setCalendarAutoEnable,
  } = useDoNotDisturb();
  
  const adaptation = useAdaptationSafe();
  
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Omit<DNDSchedule, "id">>({
    name: "",
    enabled: true,
    startTime: "09:00",
    endTime: "12:00",
    days: [1, 2, 3, 4, 5],
  });
  const [expandedSchedule, setExpandedSchedule] = useState<string | null>(null);
  
  const handleAddSchedule = () => {
    if (newSchedule.name.trim()) {
      addSchedule(newSchedule);
      setNewSchedule({
        name: "",
        enabled: true,
        startTime: "09:00",
        endTime: "12:00",
        days: [1, 2, 3, 4, 5],
      });
      setShowAddSchedule(false);
    }
  };
  
  const toggleDay = (day: number) => {
    setNewSchedule(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day].sort(),
    }));
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-card rounded-2xl border border-border shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                dndState.isActive ? "bg-primary/20" : "bg-muted"
              }`}>
                {dndState.isActive ? (
                  <BellOff className="h-6 w-6 text-primary" />
                ) : (
                  <Bell className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-display font-medium text-foreground">
                  Do Not Disturb
                </h2>
                <p className="text-sm text-muted-foreground">
                  {dndState.isActive 
                    ? `Active: ${dndState.reason}` 
                    : "Manage your focus time"}
                </p>
              </div>
            </div>
            <Switch
              checked={dndState.isActive && dndState.trigger === "manual"}
              onCheckedChange={toggleDND}
            />
          </div>
          
          {/* Quick Enable Options */}
          {!dndState.isActive && (
            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-3">Quick enable</p>
              <div className="grid grid-cols-4 gap-2">
                {QUICK_DND_OPTIONS.map(option => (
                  <Button
                    key={option.label}
                    variant="outline"
                    size="sm"
                    onClick={() => enableDND(option.duration, option.label)}
                    className="text-xs"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Active DND Info */}
          {dndState.isActive && (
            <GlassCard className="p-4 mb-6 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Moon className="h-4 w-4 text-primary" />
                    Currently active
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Triggered by: {dndState.trigger}
                    {dndState.endsAt && ` • Ends ${dndState.endsAt.toLocaleTimeString()}`}
                  </p>
                </div>
                {dndState.trigger === "manual" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={disableDND}
                  >
                    End now
                  </Button>
                )}
              </div>
            </GlassCard>
          )}
          
          {/* Smart Triggers */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Smart Triggers
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-foreground/5">
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Cognitive State</p>
                    <p className="text-xs text-muted-foreground">
                      Auto-enable during flow, hyperfocus, or overload
                    </p>
                  </div>
                </div>
                <Switch
                  checked={cognitiveAutoEnable}
                  onCheckedChange={setCognitiveAutoEnable}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-foreground/5">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Calendar Events</p>
                    <p className="text-xs text-muted-foreground">
                      Auto-enable during focus blocks
                    </p>
                  </div>
                </div>
                <Switch
                  checked={calendarAutoEnable}
                  onCheckedChange={setCalendarAutoEnable}
                />
              </div>
              
              {adaptation && (
                <div className="p-3 rounded-xl bg-foreground/5">
                  <p className="text-xs text-muted-foreground">
                    Current state: <span className="text-foreground capitalize">{adaptation.momentState}</span>
                    {cognitiveAutoEnable && ["flow", "hyperfocus", "overload"].includes(adaptation.momentState) && (
                      <span className="text-primary ml-2">→ DND would activate</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Schedules */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Schedules
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddSchedule(!showAddSchedule)}
                className="gap-1 h-7 text-xs"
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
            </div>
            
            {/* Add Schedule Form */}
            {showAddSchedule && (
              <GlassCard className="p-4 mb-3">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Schedule name"
                    value={newSchedule.name}
                    onChange={e => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-foreground/5 text-foreground text-sm outline-none"
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Start</label>
                      <input
                        type="time"
                        value={newSchedule.startTime}
                        onChange={e => setNewSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg bg-foreground/5 text-foreground text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">End</label>
                      <input
                        type="time"
                        value={newSchedule.endTime}
                        onChange={e => setNewSchedule(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg bg-foreground/5 text-foreground text-sm outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Days</label>
                    <div className="flex gap-1">
                      {DAYS.map((day, i) => (
                        <button
                          key={day}
                          onClick={() => toggleDay(i)}
                          className={`w-9 h-9 rounded-lg text-xs font-medium transition-all ${
                            newSchedule.days.includes(i)
                              ? "bg-primary text-primary-foreground"
                              : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddSchedule(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddSchedule}
                      className="flex-1"
                    >
                      Add Schedule
                    </Button>
                  </div>
                </div>
              </GlassCard>
            )}
            
            {/* Schedule List */}
            <div className="space-y-2">
              {schedules.map(schedule => (
                <div
                  key={schedule.id}
                  className="rounded-xl bg-foreground/5 overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer"
                    onClick={() => setExpandedSchedule(
                      expandedSchedule === schedule.id ? null : schedule.id
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={schedule.enabled}
                        onCheckedChange={(enabled) => updateSchedule(schedule.id, { enabled })}
                        onClick={e => e.stopPropagation()}
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">{schedule.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {schedule.startTime} - {schedule.endTime}
                        </p>
                      </div>
                    </div>
                    {expandedSchedule === schedule.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  {expandedSchedule === schedule.id && (
                    <div className="px-3 pb-3 pt-0">
                      <div className="flex gap-1 mb-3">
                        {DAYS.map((day, i) => (
                          <div
                            key={day}
                            className={`w-8 h-6 rounded text-xs flex items-center justify-center ${
                              schedule.days.includes(i)
                                ? "bg-primary/20 text-primary"
                                : "bg-foreground/5 text-muted-foreground"
                            }`}
                          >
                            {day[0]}
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSchedule(schedule.id)}
                        className="text-destructive hover:text-destructive gap-1 h-7 text-xs"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
