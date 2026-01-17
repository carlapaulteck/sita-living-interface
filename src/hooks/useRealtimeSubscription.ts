import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type TableName = 'realtime_metrics' | 'activity_feed' | 'notifications' | 'profiles' | 'user_preferences';

interface UseRealtimeSubscriptionOptions<T> {
  table: TableName;
  filter?: Record<string, unknown>;
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: T) => void;
  onDelete?: (payload: { old: T }) => void;
  enabled?: boolean;
}

interface UseRealtimeSubscriptionResult<T> {
  data: T[];
  isConnected: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useRealtimeSubscription<T extends Record<string, unknown>>({
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
}: UseRealtimeSubscriptionOptions<T>): UseRealtimeSubscriptionResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      let query = supabase.from(table).select("*");
      
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      const { data: fetchedData, error: fetchError } = await query.order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      setData((fetchedData as T[]) || []);
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  }, [table, filter]);

  useEffect(() => {
    if (!enabled) return;

    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      await fetchData();

      channel = supabase
        .channel(`${table}-changes`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: table,
          },
          (payload: RealtimePostgresChangesPayload<T>) => {
            if (payload.eventType === "INSERT") {
              const newRecord = payload.new as T;
              setData((prev) => [newRecord, ...prev]);
              onInsert?.(newRecord);
            } else if (payload.eventType === "UPDATE") {
              const updatedRecord = payload.new as T;
              setData((prev) =>
                prev.map((item) =>
                  (item as Record<string, unknown>).id === (updatedRecord as Record<string, unknown>).id 
                    ? updatedRecord 
                    : item
                )
              );
              onUpdate?.(updatedRecord);
            } else if (payload.eventType === "DELETE") {
              const deletedRecord = payload.old as T;
              setData((prev) =>
                prev.filter((item) => (item as Record<string, unknown>).id !== (deletedRecord as Record<string, unknown>).id)
              );
              onDelete?.({ old: deletedRecord });
            }
          }
        )
        .subscribe((status) => {
          setIsConnected(status === "SUBSCRIBED");
        });
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, enabled, fetchData, onInsert, onUpdate, onDelete]);

  return {
    data,
    isConnected,
    error,
    refetch: fetchData,
  };
}
