import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface CalendarEvent {
  id: string;
  user_id: string;
  external_id?: string;
  calendar_source: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  is_all_day: boolean;
  is_focus_block: boolean;
  is_meeting: boolean;
  attendees: any[];
  recurrence_rule?: string;
  color?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  is_all_day?: boolean;
  is_focus_block?: boolean;
  is_meeting?: boolean;
  color?: string;
}

export function useCalendarEvents() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async (startDate?: Date, endDate?: Date) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      let query = supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", user.id)
        .order("start_time", { ascending: true });
      
      if (startDate) {
        query = query.gte("start_time", startDate.toISOString());
      }
      if (endDate) {
        query = query.lte("end_time", endDate.toISOString());
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      // Cast the data to our interface type
      setEvents((data || []) as CalendarEvent[]);
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Error loading events",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const createEvent = useCallback(async (input: CreateEventInput) => {
    if (!user) return null;
    
    try {
      const { data, error: createError } = await supabase
        .from("calendar_events")
        .insert({
          user_id: user.id,
          title: input.title,
          description: input.description,
          start_time: input.start_time,
          end_time: input.end_time,
          location: input.location,
          is_all_day: input.is_all_day || false,
          is_focus_block: input.is_focus_block || false,
          is_meeting: input.is_meeting || false,
          color: input.color,
        })
        .select()
        .single();
      
      if (createError) throw createError;
      
      const newEvent = data as CalendarEvent;
      setEvents(prev => [...prev, newEvent].sort((a, b) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      ));
      
      toast({
        title: "Event created",
        description: `"${input.title}" has been added to your calendar`,
      });
      
      return newEvent;
    } catch (err) {
      toast({
        title: "Failed to create event",
        description: (err as Error).message,
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  const updateEvent = useCallback(async (id: string, updates: Partial<CreateEventInput>) => {
    if (!user) return false;
    
    try {
      const { error: updateError } = await supabase
        .from("calendar_events")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id);
      
      if (updateError) throw updateError;
      
      setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, ...updates } : event
      ));
      
      return true;
    } catch (err) {
      toast({
        title: "Failed to update event",
        description: (err as Error).message,
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  const deleteEvent = useCallback(async (id: string) => {
    if (!user) return false;
    
    try {
      const { error: deleteError } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      
      if (deleteError) throw deleteError;
      
      setEvents(prev => prev.filter(event => event.id !== id));
      
      toast({
        title: "Event deleted",
        description: "The event has been removed from your calendar",
      });
      
      return true;
    } catch (err) {
      toast({
        title: "Failed to delete event",
        description: (err as Error).message,
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  // Get today's events
  const getTodayEvents = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return events.filter(event => {
      const eventStart = new Date(event.start_time);
      return eventStart >= today && eventStart < tomorrow;
    });
  }, [events]);

  // Get focus blocks for DND triggers
  const getFocusBlocks = useCallback(() => {
    return events.filter(event => event.is_focus_block);
  }, [events]);

  // Check if currently in a focus block or meeting
  const getCurrentEventStatus = useCallback(() => {
    const now = new Date();
    const currentEvent = events.find(event => {
      const start = new Date(event.start_time);
      const end = new Date(event.end_time);
      return now >= start && now <= end;
    });
    
    return {
      isInEvent: !!currentEvent,
      currentEvent,
      isInFocusBlock: currentEvent?.is_focus_block || false,
      isInMeeting: currentEvent?.is_meeting || false,
    };
  }, [events]);

  useEffect(() => {
    if (user) {
      // Fetch events for the next 30 days
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // Include past week
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      fetchEvents(startDate, endDate);
    }
  }, [user, fetchEvents]);

  return {
    events,
    isLoading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getTodayEvents,
    getFocusBlocks,
    getCurrentEventStatus,
  };
}
