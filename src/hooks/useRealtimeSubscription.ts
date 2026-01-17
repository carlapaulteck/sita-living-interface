import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

type TableName = 'realtime_metrics' | 'activity_feed' | 'notifications' | 'profiles' | 'user_preferences';

interface UseRealtimeSubscriptionOptions {
  table: TableName;
  filter?: Record<string, string>;
  onInsert?: (payload: Record<string, unknown>) => void;
  onUpdate?: (payload: Record<string, unknown>) => void;
  onDelete?: (payload: { old: Record<string, unknown> }) => void;
  enabled?: boolean;
}

interface UseRealtimeSubscriptionResult {
  data: Record<string, unknown>[];
  isConnected: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useRealtimeSubscription({
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
}: UseRealtimeSubscriptionOptions): UseRealtimeSubscriptionResult {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // Build the query without chaining eq calls dynamically
      const { data: fetchedData, error: fetchError } = await supabase
        .from(table)
        .select("*")
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      // Apply filter client-side if provided
      let filteredData = fetchedData || [];
      if (filter && filteredData.length > 0) {
        filteredData = filteredData.filter((item: Record<string, unknown>) => {
          return Object.entries(filter).every(([key, value]) => item[key] === value);
        });
      }
      
      setData(filteredData as Record<string, unknown>[]);
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
        .channel(`${table}-changes-${Date.now()}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: table,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              const newRecord = payload.new as Record<string, unknown>;
              setData((prev) => [newRecord, ...prev]);
              onInsert?.(newRecord);
            } else if (payload.eventType === "UPDATE") {
              const updatedRecord = payload.new as Record<string, unknown>;
              setData((prev) =>
                prev.map((item) =>
                  item.id === updatedRecord.id ? updatedRecord : item
                )
              );
              onUpdate?.(updatedRecord);
            } else if (payload.eventType === "DELETE") {
              const deletedRecord = payload.old as Record<string, unknown>;
              setData((prev) =>
                prev.filter((item) => item.id !== deletedRecord.id)
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
