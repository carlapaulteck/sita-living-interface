// Automation Types for History and Custom Builder

export interface AutomationRun {
  id: string;
  user_id: string;
  automation_id: string;
  automation_name: string;
  trigger_event: string;
  actions_taken: ActionTaken[];
  status: 'success' | 'partial' | 'failed';
  created_at: string;
  metadata: Record<string, any>;
}

export interface ActionTaken {
  type: string;
  description: string;
  result?: string;
}

export interface UserAutomation {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_config: TriggerConfig;
  action_type: string;
  action_config: ActionConfig;
  is_enabled: boolean;
  priority: number;
  cooldown_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface TriggerConfig {
  category: 'time' | 'data' | 'event' | 'condition';
  condition?: string;
  threshold?: number;
  time?: string;
  comparison?: 'above' | 'below' | 'equals' | 'changes';
}

export interface ActionConfig {
  actions: ActionItem[];
}

export interface ActionItem {
  type: 'notification' | 'schedule' | 'wellness' | 'custom';
  action: string;
  parameters?: Record<string, any>;
}

// Available triggers for the builder
export const TRIGGER_OPTIONS = {
  time: [
    { id: 'specific_time', label: 'At specific time', description: 'Triggers at a set time each day' },
    { id: 'wake_offset', label: 'After wake time', description: 'X minutes after you wake up' },
    { id: 'before_sleep', label: 'Before sleep', description: 'X minutes before your sleep window' },
    { id: 'focus_start', label: 'Focus block starts', description: 'When a focus period begins' },
    { id: 'focus_end', label: 'Focus block ends', description: 'When a focus period ends' },
  ],
  data: [
    { id: 'sleep_score', label: 'Sleep score threshold', description: 'When sleep score crosses a threshold' },
    { id: 'hrv_change', label: 'HRV changes', description: 'When heart rate variability changes significantly' },
    { id: 'cognitive_budget', label: 'Cognitive budget', description: 'When mental energy hits a level' },
    { id: 'stress_level', label: 'Stress level', description: 'When stress exceeds threshold' },
    { id: 'revenue_threshold', label: 'Revenue threshold', description: 'When revenue hits a target' },
  ],
  event: [
    { id: 'meeting_start', label: 'Meeting starts', description: 'When a calendar meeting begins' },
    { id: 'meeting_end', label: 'Meeting ends', description: 'When a calendar meeting finishes' },
    { id: 'device_disconnect', label: 'Device disconnects', description: 'When a connected device goes offline' },
    { id: 'habit_complete', label: 'Habit completed', description: 'When you complete a habit' },
    { id: 'habit_missed', label: 'Habit missed', description: 'When a habit window passes without completion' },
  ],
  condition: [
    { id: 'low_energy', label: 'Low energy state', description: 'When energy drops to recovery levels' },
    { id: 'high_focus', label: 'High focus state', description: 'When you enter deep focus' },
    { id: 'overload_risk', label: 'Overload risk', description: 'When cognitive overload is predicted' },
    { id: 'schedule_conflict', label: 'Schedule conflict', description: 'When calendar conflicts are detected' },
  ],
};

// Available actions for the builder
export const ACTION_OPTIONS = {
  notification: [
    { id: 'send_alert', label: 'Send alert', description: 'Immediate notification' },
    { id: 'add_to_briefing', label: 'Add to briefing', description: 'Include in morning summary' },
    { id: 'batch_notification', label: 'Batch notification', description: 'Group with other notifications' },
  ],
  schedule: [
    { id: 'block_calendar', label: 'Block calendar', description: 'Create a calendar block' },
    { id: 'reschedule_tasks', label: 'Reschedule tasks', description: 'Move non-urgent tasks' },
    { id: 'extend_focus', label: 'Extend focus time', description: 'Add more focus time' },
    { id: 'clear_next_hour', label: 'Clear next hour', description: 'Free up immediate schedule' },
  ],
  wellness: [
    { id: 'suggest_break', label: 'Suggest break', description: 'Recommend a rest period' },
    { id: 'breathing_exercise', label: 'Breathing protocol', description: 'Guide through breathing' },
    { id: 'recovery_mode', label: 'Activate recovery', description: 'Enter recovery mode' },
    { id: 'wind_down', label: 'Wind-down reminder', description: 'Prepare for rest' },
  ],
  custom: [
    { id: 'log_activity', label: 'Log to activity', description: 'Record in activity feed' },
    { id: 'update_metric', label: 'Update metric', description: 'Modify a tracked metric' },
    { id: 'trigger_webhook', label: 'Trigger webhook', description: 'Call external service' },
  ],
};

export const TRIGGER_CATEGORY_COLORS = {
  time: 'cyan',
  data: 'purple',
  event: 'gold',
  condition: 'emerald',
} as const;

export const ACTION_CATEGORY_COLORS = {
  notification: 'cyan',
  schedule: 'purple',
  wellness: 'emerald',
  custom: 'gold',
} as const;
