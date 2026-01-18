import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdaptationSafe } from "@/contexts/AdaptationContext";
import { supabase } from "@/integrations/supabase/client";

export type DNDTrigger = "manual" | "schedule" | "calendar" | "cognitive" | "focus_mode";

export interface DNDSchedule {
  id: string;
  name: string;
  enabled: boolean;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  days: number[];    // 0-6, Sunday=0
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  enableDND: boolean;
}

export interface DNDState {
  isActive: boolean;
  trigger: DNDTrigger | null;
  reason: string | null;
  endsAt: Date | null;
  allowedCategories: string[]; // notification types that bypass DND
}

interface UseDoNotDisturbReturn {
  dndState: DNDState;
  schedules: DNDSchedule[];
  calendarEvents: CalendarEvent[];
  
  // Actions
  enableDND: (duration?: number, reason?: string) => void;
  disableDND: () => void;
  toggleDND: () => void;
  
  // Schedule management
  addSchedule: (schedule: Omit<DNDSchedule, "id">) => void;
  updateSchedule: (id: string, updates: Partial<DNDSchedule>) => void;
  removeSchedule: (id: string) => void;
  
  // Settings
  cognitiveAutoEnable: boolean;
  setCognitiveAutoEnable: (enabled: boolean) => void;
  calendarAutoEnable: boolean;
  setCalendarAutoEnable: (enabled: boolean) => void;
  focusModeAutoEnable: boolean;
  setFocusModeAutoEnable: (enabled: boolean) => void;
  
  // Query
  shouldAllowNotification: (category: string, priority: string) => boolean;
}

const DEFAULT_SCHEDULES: DNDSchedule[] = [
  {
    id: "sleep",
    name: "Sleep Hours",
    enabled: true,
    startTime: "22:00",
    endTime: "07:00",
    days: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    id: "focus",
    name: "Deep Work",
    enabled: false,
    startTime: "09:00",
    endTime: "12:00",
    days: [1, 2, 3, 4, 5], // Weekdays
  },
];

export function useDoNotDisturb(): UseDoNotDisturbReturn {
  const { user } = useAuth();
  const adaptation = useAdaptationSafe();
  
  // State
  const [manualDND, setManualDND] = useState(false);
  const [manualEndsAt, setManualEndsAt] = useState<Date | null>(null);
  const [manualReason, setManualReason] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<DNDSchedule[]>(DEFAULT_SCHEDULES);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  
  // Settings
  const [cognitiveAutoEnable, setCognitiveAutoEnable] = useState(true);
  const [calendarAutoEnable, setCalendarAutoEnable] = useState(true);
  const [focusModeAutoEnable, setFocusModeAutoEnable] = useState(true);
  
  // Check schedule-based DND
  const isInSchedule = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (const schedule of schedules) {
      if (!schedule.enabled || !schedule.days.includes(currentDay)) continue;
      
      const [startH, startM] = schedule.startTime.split(":").map(Number);
      const [endH, endM] = schedule.endTime.split(":").map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      
      // Handle overnight schedules
      if (startMinutes > endMinutes) {
        if (currentTime >= startMinutes || currentTime < endMinutes) {
          return { active: true, schedule };
        }
      } else {
        if (currentTime >= startMinutes && currentTime < endMinutes) {
          return { active: true, schedule };
        }
      }
    }
    
    return { active: false, schedule: null };
  }, [schedules]);
  
  // Check calendar-based DND
  const isInCalendarEvent = useMemo(() => {
    if (!calendarAutoEnable) return { active: false, event: null };
    
    const now = new Date();
    const activeEvent = calendarEvents.find(
      event => event.enableDND && now >= event.start && now < event.end
    );
    
    return { active: !!activeEvent, event: activeEvent || null };
  }, [calendarEvents, calendarAutoEnable]);
  
  // Check cognitive state DND
  const isCognitiveTriggered = useMemo(() => {
    if (!cognitiveAutoEnable || !adaptation) return false;
    
    // Enable DND during overload, hyperfocus, or flow states
    const protectedStates = ["overload", "hyperfocus", "flow"];
    return protectedStates.includes(adaptation.momentState);
  }, [adaptation?.momentState, cognitiveAutoEnable]);
  
  // Computed DND state
  const dndState = useMemo((): DNDState => {
    // Priority: Manual > Schedule > Calendar > Cognitive
    if (manualDND) {
      return {
        isActive: true,
        trigger: "manual",
        reason: manualReason,
        endsAt: manualEndsAt,
        allowedCategories: ["critical"],
      };
    }
    
    if (isInSchedule.active) {
      return {
        isActive: true,
        trigger: "schedule",
        reason: `${isInSchedule.schedule?.name} active`,
        endsAt: null, // Could calculate from schedule
        allowedCategories: ["critical"],
      };
    }
    
    if (isInCalendarEvent.active) {
      return {
        isActive: true,
        trigger: "calendar",
        reason: isInCalendarEvent.event?.title || "Calendar event",
        endsAt: isInCalendarEvent.event?.end || null,
        allowedCategories: ["critical"],
      };
    }
    
    if (isCognitiveTriggered) {
      return {
        isActive: true,
        trigger: "cognitive",
        reason: `Protecting ${adaptation?.momentState} state`,
        endsAt: null,
        allowedCategories: ["critical", "important"],
      };
    }
    
    return {
      isActive: false,
      trigger: null,
      reason: null,
      endsAt: null,
      allowedCategories: [],
    };
  }, [manualDND, manualReason, manualEndsAt, isInSchedule, isInCalendarEvent, isCognitiveTriggered, adaptation?.momentState]);
  
  // Actions
  const enableDND = useCallback((duration?: number, reason?: string) => {
    setManualDND(true);
    setManualReason(reason || "Manual activation");
    if (duration) {
      setManualEndsAt(new Date(Date.now() + duration * 60 * 1000));
    } else {
      setManualEndsAt(null);
    }
  }, []);
  
  const disableDND = useCallback(() => {
    setManualDND(false);
    setManualEndsAt(null);
    setManualReason(null);
  }, []);
  
  const toggleDND = useCallback(() => {
    if (manualDND) {
      disableDND();
    } else {
      enableDND(undefined, "Quick toggle");
    }
  }, [manualDND, enableDND, disableDND]);
  
  // Schedule management
  const addSchedule = useCallback((schedule: Omit<DNDSchedule, "id">) => {
    const newSchedule: DNDSchedule = {
      ...schedule,
      id: `schedule_${Date.now()}`,
    };
    setSchedules(prev => [...prev, newSchedule]);
  }, []);
  
  const updateSchedule = useCallback((id: string, updates: Partial<DNDSchedule>) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);
  
  const removeSchedule = useCallback((id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  }, []);
  
  // Query
  const shouldAllowNotification = useCallback((category: string, priority: string): boolean => {
    if (!dndState.isActive) return true;
    
    // Critical always gets through
    if (priority === "critical") return true;
    
    // Check allowed categories
    if (dndState.allowedCategories.includes(category)) return true;
    if (dndState.allowedCategories.includes(priority)) return true;
    
    return false;
  }, [dndState]);
  
  // Auto-disable when manual timer expires
  useEffect(() => {
    if (manualEndsAt) {
      const timeout = manualEndsAt.getTime() - Date.now();
      if (timeout > 0) {
        const timer = setTimeout(disableDND, timeout);
        return () => clearTimeout(timer);
      } else {
        disableDND();
      }
    }
  }, [manualEndsAt, disableDND]);
  
  return {
    dndState,
    schedules,
    calendarEvents,
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
    focusModeAutoEnable,
    setFocusModeAutoEnable,
    shouldAllowNotification,
  };
}
