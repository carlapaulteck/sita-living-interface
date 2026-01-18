import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAdaptationSafe } from "@/contexts/AdaptationContext";
import { useDoNotDisturb } from "@/hooks/useDoNotDisturb";

interface NotificationBatch {
  id: string;
  user_id: string;
  batch_type: string;
  status: string;
  scheduled_for: string | null;
  delivered_at: string | null;
  notification_ids: string[];
  cognitive_state: string | null;
  priority: string;
  created_at: string;
}

interface BatchConfig {
  enabled: boolean;
  digestTimes: string[]; // Times to deliver digest (e.g., ["09:00", "14:00", "18:00"])
  batchDuringFocus: boolean;
  batchDuringMeetings: boolean;
  batchDuringOverload: boolean;
  immediatePriorities: string[]; // Priorities that bypass batching
}

const DEFAULT_CONFIG: BatchConfig = {
  enabled: true,
  digestTimes: ["09:00", "14:00", "18:00"],
  batchDuringFocus: true,
  batchDuringMeetings: true,
  batchDuringOverload: true,
  immediatePriorities: ["urgent", "critical"],
};

export function useNotificationBatching() {
  const { user } = useAuth();
  const adaptation = useAdaptationSafe();
  const { dndState } = useDoNotDisturb();
  
  const [batches, setBatches] = useState<NotificationBatch[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [config, setConfig] = useState<BatchConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  // Determine if we should batch notifications right now
  const shouldBatch = useCallback((): { batch: boolean; reason?: string } => {
    if (!config.enabled) {
      return { batch: false };
    }
    
    // Check DND
    if (dndState.isActive) {
      return { batch: true, reason: "Do Not Disturb is active" };
    }
    
    // Check cognitive state
    if (config.batchDuringOverload && adaptation?.momentState === "overload") {
      return { batch: true, reason: "You're in overload state - notifications are being held" };
    }
    
    if (adaptation?.momentState === "flow" || adaptation?.momentState === "hyperfocus") {
      return { batch: true, reason: "You're in deep focus - notifications are being batched" };
    }
    
    return { batch: false };
  }, [config, dndState.isActive, adaptation?.momentState]);

  // Queue a notification for batching
  const queueNotification = useCallback(async (notificationId: string, priority: string = "normal") => {
    if (!user) return false;
    
    // Check if this priority should bypass batching
    if (config.immediatePriorities.includes(priority)) {
      return false; // Don't batch, deliver immediately
    }
    
    const batchCheck = shouldBatch();
    if (!batchCheck.batch) {
      return false; // Don't batch
    }
    
    try {
      // Find or create a pending batch
      const { data: existingBatch } = await supabase
        .from("notification_batches")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      
      if (existingBatch) {
        // Add to existing batch
        const updatedIds = [...(existingBatch.notification_ids || []), notificationId];
        await supabase
          .from("notification_batches")
          .update({ 
            notification_ids: updatedIds,
            cognitive_state: adaptation?.momentState || null,
          })
          .eq("id", existingBatch.id);
      } else {
        // Create new batch
        const nextDigestTime = getNextDigestTime();
        await supabase
          .from("notification_batches")
          .insert({
            user_id: user.id,
            batch_type: "digest",
            status: "pending",
            scheduled_for: nextDigestTime,
            notification_ids: [notificationId],
            cognitive_state: adaptation?.momentState || null,
            priority: priority,
          });
      }
      
      setPendingCount(prev => prev + 1);
      return true;
    } catch (err) {
      console.error("Error queuing notification:", err);
      return false;
    }
  }, [user, config, adaptation?.momentState, shouldBatch]);

  // Get next scheduled digest time
  const getNextDigestTime = useCallback((): string => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeStr = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;
    
    // Find next digest time
    const sortedTimes = [...config.digestTimes].sort();
    const nextTime = sortedTimes.find(time => time > currentTimeStr);
    
    const result = new Date(now);
    if (nextTime) {
      const [hours, minutes] = nextTime.split(":").map(Number);
      result.setHours(hours, minutes, 0, 0);
    } else {
      // Next day's first digest
      const [hours, minutes] = sortedTimes[0].split(":").map(Number);
      result.setDate(result.getDate() + 1);
      result.setHours(hours, minutes, 0, 0);
    }
    
    return result.toISOString();
  }, [config.digestTimes]);

  // Deliver a batch immediately
  const deliverBatch = useCallback(async (batchId: string) => {
    if (!user) return false;
    
    try {
      const { data: batch } = await supabase
        .from("notification_batches")
        .select("*")
        .eq("id", batchId)
        .single();
      
      if (!batch) return false;
      
      // Mark notifications as ready to deliver
      if (batch.notification_ids && batch.notification_ids.length > 0) {
        await supabase
          .from("notifications")
          .update({ 
            read: false, // Ensure they show up as unread
          })
          .in("id", batch.notification_ids);
      }
      
      // Mark batch as delivered
      await supabase
        .from("notification_batches")
        .update({ 
          status: "delivered",
          delivered_at: new Date().toISOString(),
        })
        .eq("id", batchId);
      
      setBatches(prev => prev.map(b => 
        b.id === batchId ? { ...b, status: "delivered", delivered_at: new Date().toISOString() } : b
      ));
      
      setPendingCount(prev => Math.max(0, prev - (batch.notification_ids?.length || 0)));
      
      return true;
    } catch (err) {
      console.error("Error delivering batch:", err);
      return false;
    }
  }, [user]);

  // Deliver all pending batches
  const deliverAllPending = useCallback(async () => {
    const pendingBatches = batches.filter(b => b.status === "pending");
    for (const batch of pendingBatches) {
      await deliverBatch(batch.id);
    }
  }, [batches, deliverBatch]);

  // Fetch pending batches
  const fetchBatches = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("notification_batches")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      setBatches(data || []);
      const totalPending = (data || []).reduce((acc, b) => acc + (b.notification_ids?.length || 0), 0);
      setPendingCount(totalPending);
    } catch (err) {
      console.error("Error fetching batches:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Update config
  const updateConfig = useCallback((updates: Partial<BatchConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    // Persist to localStorage
    localStorage.setItem("notification_batch_config", JSON.stringify({ ...config, ...updates }));
  }, [config]);

  // Load config from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("notification_batch_config");
    if (saved) {
      try {
        setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(saved) });
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Fetch batches on mount
  useEffect(() => {
    if (user) {
      fetchBatches();
    }
  }, [user, fetchBatches]);

  // Check for scheduled deliveries
  useEffect(() => {
    if (!user) return;
    
    const checkScheduled = async () => {
      const now = new Date();
      const dueBatches = batches.filter(b => 
        b.status === "pending" && 
        b.scheduled_for && 
        new Date(b.scheduled_for) <= now
      );
      
      // Only deliver if not in a batching state
      if (!shouldBatch().batch) {
        for (const batch of dueBatches) {
          await deliverBatch(batch.id);
        }
      }
    };
    
    const interval = setInterval(checkScheduled, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user, batches, shouldBatch, deliverBatch]);

  return {
    batches,
    pendingCount,
    config,
    isLoading,
    shouldBatch,
    queueNotification,
    deliverBatch,
    deliverAllPending,
    updateConfig,
    fetchBatches,
  };
}
