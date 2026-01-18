import { useState, useEffect, useCallback } from "react";
import { useHabits, Habit } from "./useHabits";
import { useToast } from "./use-toast";

export interface HabitReminder {
  habitId: string;
  habitName: string;
  scheduledTime: string;
  isEnabled: boolean;
  lastReminded?: string;
}

export function useHabitReminders() {
  const { habits } = useHabits();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<HabitReminder[]>([]);
  const [activeTimers, setActiveTimers] = useState<Map<string, NodeJS.Timeout>>(new Map());

  // Load saved reminders from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sita_habit_reminders");
    if (saved) {
      try {
        setReminders(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse habit reminders:", e);
      }
    }
  }, []);

  // Save reminders to localStorage
  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem("sita_habit_reminders", JSON.stringify(reminders));
    }
  }, [reminders]);

  // Set up reminder timers
  useEffect(() => {
    // Clear existing timers
    activeTimers.forEach((timer) => clearTimeout(timer));
    setActiveTimers(new Map());

    const now = new Date();
    const newTimers = new Map<string, NodeJS.Timeout>();

    reminders.forEach((reminder) => {
      if (!reminder.isEnabled) return;

      const habit = habits.find((h) => h.id === reminder.habitId);
      if (!habit) return;

      // Parse scheduled time
      const [hours, minutes] = reminder.scheduledTime.split(":").map(Number);
      const scheduledDate = new Date();
      scheduledDate.setHours(hours, minutes, 0, 0);

      // If the time has passed today, skip
      if (scheduledDate <= now) {
        return;
      }

      const timeUntil = scheduledDate.getTime() - now.getTime();

      const timer = setTimeout(() => {
        triggerReminder(habit);
      }, timeUntil);

      newTimers.set(reminder.habitId, timer);
    });

    setActiveTimers(newTimers);

    return () => {
      newTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [reminders, habits]);

  const triggerReminder = useCallback(
    async (habit: Habit) => {
      // Show in-app toast
      toast({
        title: `Time for: ${habit.name}`,
        description: habit.description || "Don't forget to complete your habit!",
        duration: 10000,
      });

      // Try to send browser notification
      try {
        if (Notification.permission === 'granted' && 'serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification(`Habit Reminder: ${habit.name}`, {
            body: habit.description || "Time to complete your habit!",
            icon: '/favicon.ico',
            tag: `habit-${habit.id}`,
          });
        }
      } catch (e) {
        console.log("Push notification not available");
      }

      // Update last reminded
      setReminders((prev) =>
        prev.map((r) =>
          r.habitId === habit.id
            ? { ...r, lastReminded: new Date().toISOString() }
            : r
        )
      );
    },
    [toast]
  );

  const enableReminder = useCallback(
    (habitId: string, time: string) => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return;

      setReminders((prev) => {
        const existing = prev.find((r) => r.habitId === habitId);
        if (existing) {
          return prev.map((r) =>
            r.habitId === habitId
              ? { ...r, scheduledTime: time, isEnabled: true }
              : r
          );
        }
        return [
          ...prev,
          {
            habitId,
            habitName: habit.name,
            scheduledTime: time,
            isEnabled: true,
          },
        ];
      });

      toast({
        title: "Reminder set",
        description: `You'll be reminded at ${time} for "${habit.name}"`,
      });
    },
    [habits, toast]
  );

  const disableReminder = useCallback(
    (habitId: string) => {
      setReminders((prev) =>
        prev.map((r) => (r.habitId === habitId ? { ...r, isEnabled: false } : r))
      );

      // Clear the timer
      const timer = activeTimers.get(habitId);
      if (timer) {
        clearTimeout(timer);
        setActiveTimers((prev) => {
          const newMap = new Map(prev);
          newMap.delete(habitId);
          return newMap;
        });
      }
    },
    [activeTimers]
  );

  const removeReminder = useCallback((habitId: string) => {
    setReminders((prev) => prev.filter((r) => r.habitId !== habitId));
  }, []);

  const getReminderForHabit = useCallback(
    (habitId: string): HabitReminder | undefined => {
      return reminders.find((r) => r.habitId === habitId);
    },
    [reminders]
  );

  const getUpcomingReminders = useCallback(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    return reminders
      .filter((r) => r.isEnabled && r.scheduledTime > currentTime)
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
      .map((r) => ({
        ...r,
        habit: habits.find((h) => h.id === r.habitId),
      }));
  }, [reminders, habits]);

  return {
    reminders,
    enableReminder,
    disableReminder,
    removeReminder,
    getReminderForHabit,
    getUpcomingReminders,
  };
}
