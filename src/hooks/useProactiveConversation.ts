import { useState, useEffect, useCallback, useRef } from 'react';
import { useCognitiveState } from './useCognitiveState';
import { useCalendarEvents } from './useCalendarEvents';
import { useAuth } from './useAuth';

export type ProactiveTriggerType = 
  | 'morning_briefing'
  | 'cognitive_state_change'
  | 'calendar_reminder'
  | 'idle_check_in'
  | 'stress_alert'
  | 'focus_completion'
  | 'pattern_detected'
  | 'goal_progress';

interface ProactiveTrigger {
  type: ProactiveTriggerType;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, unknown>;
  timestamp: Date;
  dismissed: boolean;
}

interface ProactiveConfig {
  enableMorningBriefing: boolean;
  enableCognitiveAlerts: boolean;
  enableCalendarReminders: boolean;
  enableIdleCheckIns: boolean;
  idleThresholdMinutes: number;
  briefingHour: number;
}

const DEFAULT_CONFIG: ProactiveConfig = {
  enableMorningBriefing: true,
  enableCognitiveAlerts: true,
  enableCalendarReminders: true,
  enableIdleCheckIns: true,
  idleThresholdMinutes: 30,
  briefingHour: 8,
};

export function useProactiveConversation(config: Partial<ProactiveConfig> = {}) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const { user } = useAuth();
  const { state: cognitiveState, stressIndex, focusLevel } = useCognitiveState();
  const { events: upcomingEvents } = useCalendarEvents();
  
  const [triggers, setTriggers] = useState<ProactiveTrigger[]>([]);
  const [activeTrigger, setActiveTrigger] = useState<ProactiveTrigger | null>(null);
  const [lastInteraction, setLastInteraction] = useState<Date>(new Date());
  
  const previousState = useRef<string | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Add a new trigger
  const addTrigger = useCallback((
    type: ProactiveTriggerType,
    message: string,
    priority: ProactiveTrigger['priority'] = 'medium',
    metadata?: Record<string, unknown>
  ) => {
    const newTrigger: ProactiveTrigger = {
      type,
      message,
      priority,
      metadata,
      timestamp: new Date(),
      dismissed: false,
    };
    
    setTriggers(prev => [newTrigger, ...prev].slice(0, 20));
    
    // Auto-activate high priority triggers
    if (priority === 'high' || priority === 'critical') {
      setActiveTrigger(newTrigger);
    }
  }, []);

  // Dismiss a trigger
  const dismissTrigger = useCallback((timestamp: Date) => {
    setTriggers(prev => 
      prev.map(t => 
        t.timestamp === timestamp ? { ...t, dismissed: true } : t
      )
    );
    
    if (activeTrigger?.timestamp === timestamp) {
      setActiveTrigger(null);
    }
  }, [activeTrigger]);

  // Record user interaction
  const recordInteraction = useCallback(() => {
    setLastInteraction(new Date());
  }, []);

  // Check for morning briefing
  useEffect(() => {
    if (!mergedConfig.enableMorningBriefing || !user) return;

    const checkMorningBriefing = () => {
      const now = new Date();
      const hour = now.getHours();
      const today = now.toDateString();
      const briefingKey = `briefing_shown_${today}`;
      
      if (hour === mergedConfig.briefingHour) {
        const shown = localStorage.getItem(briefingKey);
        if (!shown) {
          addTrigger(
            'morning_briefing',
            "Good morning! Ready to review your day? I've prepared a briefing based on your calendar and priorities.",
            'medium',
            { upcomingEvents: upcomingEvents?.slice(0, 3) }
          );
          localStorage.setItem(briefingKey, 'true');
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkMorningBriefing, 60000);
    checkMorningBriefing(); // Check immediately

    return () => clearInterval(interval);
  }, [mergedConfig.enableMorningBriefing, mergedConfig.briefingHour, user, upcomingEvents, addTrigger]);

  // Monitor cognitive state changes
  useEffect(() => {
    if (!mergedConfig.enableCognitiveAlerts) return;
    
    if (previousState.current && cognitiveState !== previousState.current) {
      // State transition detected
      if (cognitiveState === 'overload' && previousState.current !== 'overload') {
        addTrigger(
          'cognitive_state_change',
          "I notice you might be feeling overwhelmed. Would you like to take a short break or talk through what's on your mind?",
          'high',
          { previousState: previousState.current, newState: cognitiveState }
        );
      } else if (cognitiveState === 'flow' && previousState.current !== 'flow') {
        addTrigger(
          'cognitive_state_change',
          "You seem to be in a great flow state. I'll minimize interruptions to help you stay focused.",
          'low',
          { previousState: previousState.current, newState: cognitiveState }
        );
      } else if (previousState.current === 'flow' && cognitiveState !== 'flow') {
        addTrigger(
          'focus_completion',
          "Great focus session! Take a moment to stretch or grab some water. Would you like me to summarize what you accomplished?",
          'medium',
          { previousState: previousState.current, newState: cognitiveState }
        );
      }
    }
    
    previousState.current = cognitiveState;
  }, [cognitiveState, mergedConfig.enableCognitiveAlerts, addTrigger]);

  // Monitor stress levels
  useEffect(() => {
    if (!mergedConfig.enableCognitiveAlerts) return;
    
    if (stressIndex > 0.8) {
      addTrigger(
        'stress_alert',
        "Your stress indicators seem elevated. Remember to breathe. Would you like some calming suggestions or to talk about what's bothering you?",
        'high',
        { stressIndex }
      );
    }
  }, [stressIndex, mergedConfig.enableCognitiveAlerts, addTrigger]);

  // Calendar reminders
  useEffect(() => {
    if (!mergedConfig.enableCalendarReminders || !upcomingEvents?.length) return;

    const checkUpcomingEvents = () => {
      const now = new Date();
      const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60000);
      
      upcomingEvents.forEach(event => {
        const eventStart = new Date(event.start_time);
        const reminderKey = `reminder_${event.id}`;
        
        if (eventStart > now && eventStart <= fifteenMinutesFromNow) {
          const shown = localStorage.getItem(reminderKey);
          if (!shown) {
            addTrigger(
              'calendar_reminder',
              `Heads up! "${event.title}" starts in about 15 minutes. Need any preparation help?`,
              'medium',
              { event }
            );
            localStorage.setItem(reminderKey, 'true');
          }
        }
      });
    };

    const interval = setInterval(checkUpcomingEvents, 60000);
    checkUpcomingEvents();

    return () => clearInterval(interval);
  }, [upcomingEvents, mergedConfig.enableCalendarReminders, addTrigger]);

  // Idle check-ins
  useEffect(() => {
    if (!mergedConfig.enableIdleCheckIns) return;

    checkIntervalRef.current = setInterval(() => {
      const now = new Date();
      const idleMinutes = (now.getTime() - lastInteraction.getTime()) / 60000;
      
      if (idleMinutes >= mergedConfig.idleThresholdMinutes) {
        // Only trigger once per idle session
        const idleKey = `idle_checkin_${lastInteraction.getTime()}`;
        const shown = localStorage.getItem(idleKey);
        
        if (!shown) {
          addTrigger(
            'idle_check_in',
            "You've been quiet for a while. Everything okay? I'm here if you need anything.",
            'low',
            { idleMinutes }
          );
          localStorage.setItem(idleKey, 'true');
        }
      }
    }, 60000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [lastInteraction, mergedConfig.enableIdleCheckIns, mergedConfig.idleThresholdMinutes, addTrigger]);

  // Get pending (non-dismissed) triggers
  const pendingTriggers = triggers.filter(t => !t.dismissed);

  // Get the most important pending trigger
  const getMostImportantTrigger = useCallback((): ProactiveTrigger | null => {
    const priority = ['critical', 'high', 'medium', 'low'];
    
    for (const p of priority) {
      const trigger = pendingTriggers.find(t => t.priority === p);
      if (trigger) return trigger;
    }
    
    return null;
  }, [pendingTriggers]);

  return {
    triggers,
    pendingTriggers,
    activeTrigger,
    addTrigger,
    dismissTrigger,
    recordInteraction,
    getMostImportantTrigger,
    setActiveTrigger,
    config: mergedConfig,
  };
}
