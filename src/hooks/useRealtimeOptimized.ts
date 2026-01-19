import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// WebSocket connection pool - share connection across subscriptions
const channelPool = new Map<string, RealtimeChannel>();
const channelRefCounts = new Map<string, number>();

// Debounced update queue for batching rapid changes
interface UpdateQueue<T> {
  pending: T[];
  timeoutId: NodeJS.Timeout | null;
  callback: ((updates: T[]) => void) | null;
}

const updateQueues = new Map<string, UpdateQueue<any>>();

// Get or create a shared channel
function getSharedChannel(channelName: string): RealtimeChannel {
  const existing = channelPool.get(channelName);
  if (existing) {
    channelRefCounts.set(channelName, (channelRefCounts.get(channelName) || 0) + 1);
    return existing;
  }

  const channel = supabase.channel(channelName, {
    config: {
      broadcast: { self: true },
      presence: { key: '' },
    },
  });

  channelPool.set(channelName, channel);
  channelRefCounts.set(channelName, 1);

  return channel;
}

// Release a shared channel
function releaseChannel(channelName: string): void {
  const refCount = (channelRefCounts.get(channelName) || 1) - 1;

  if (refCount <= 0) {
    const channel = channelPool.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      channelPool.delete(channelName);
      channelRefCounts.delete(channelName);
    }
  } else {
    channelRefCounts.set(channelName, refCount);
  }
}

// Debounced batch update handler
function queueUpdate<T>(queueKey: string, update: T, batchWindow = 100): void {
  let queue = updateQueues.get(queueKey);

  if (!queue) {
    queue = { pending: [], timeoutId: null, callback: null };
    updateQueues.set(queueKey, queue);
  }

  queue.pending.push(update);

  if (queue.timeoutId) {
    clearTimeout(queue.timeoutId);
  }

  queue.timeoutId = setTimeout(() => {
    if (queue && queue.callback && queue.pending.length > 0) {
      // Use requestAnimationFrame for smooth UI updates
      requestAnimationFrame(() => {
        queue!.callback!(queue!.pending);
        queue!.pending = [];
      });
    }
  }, batchWindow);
}

interface UseRealtimeOptions<T> {
  table: string;
  schema?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string; // e.g., "user_id=eq.123"
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: T) => void;
  onDelete?: (payload: { old: T }) => void;
  batchWindow?: number; // ms to wait before processing updates
  enabled?: boolean;
}

export function useRealtimeOptimized<T extends Record<string, any>>({
  table,
  schema = 'public',
  event = '*',
  filter,
  onInsert,
  onUpdate,
  onDelete,
  batchWindow = 100,
  enabled = true,
}: UseRealtimeOptions<T>) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const callbacksRef = useRef({ onInsert, onUpdate, onDelete });

  // Keep callbacks ref updated
  useEffect(() => {
    callbacksRef.current = { onInsert, onUpdate, onDelete };
  }, [onInsert, onUpdate, onDelete]);

  useEffect(() => {
    if (!enabled) return;

    const channelName = `realtime-${table}-${filter || 'all'}`;
    const channel = getSharedChannel(channelName);

    // Set up the queue callback
    const queueKey = channelName;
    const queue = updateQueues.get(queueKey) || { pending: [], timeoutId: null, callback: null };
    queue.callback = (updates: RealtimePostgresChangesPayload<T>[]) => {
      updates.forEach((payload) => {
        switch (payload.eventType) {
          case 'INSERT':
            callbacksRef.current.onInsert?.(payload.new as T);
            break;
          case 'UPDATE':
            callbacksRef.current.onUpdate?.(payload.new as T);
            break;
          case 'DELETE':
            callbacksRef.current.onDelete?.({ old: payload.old as T });
            break;
        }
      });
    };
    updateQueues.set(queueKey, queue);

    // Configure the subscription with server-side filtering
    const subscriptionConfig: any = {
      event,
      schema,
      table,
    };

    if (filter) {
      subscriptionConfig.filter = filter;
    }

    channel
      .on('postgres_changes', subscriptionConfig, (payload) => {
        queueUpdate(queueKey, payload, batchWindow);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      releaseChannel(channelName);
      channelRef.current = null;
    };
  }, [table, schema, event, filter, batchWindow, enabled]);

  return channelRef.current;
}

// Selective real-time updates with priority queue
interface PriorityUpdate<T> {
  data: T;
  priority: 'critical' | 'high' | 'normal' | 'low';
  timestamp: number;
}

export function useRealtimePriority<T>() {
  const [latestUpdate, setLatestUpdate] = useState<T | null>(null);
  const priorityQueue = useRef<PriorityUpdate<T>[]>([]);
  const processingRef = useRef(false);

  const processQueue = useCallback(() => {
    if (processingRef.current || priorityQueue.current.length === 0) return;

    processingRef.current = true;

    // Sort by priority and timestamp
    priorityQueue.current.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.timestamp - b.timestamp;
    });

    // Process the highest priority update
    const update = priorityQueue.current.shift();
    if (update) {
      requestAnimationFrame(() => {
        setLatestUpdate(update.data);
        processingRef.current = false;
        // Process next if queue isn't empty
        if (priorityQueue.current.length > 0) {
          setTimeout(processQueue, 16); // ~60fps
        }
      });
    } else {
      processingRef.current = false;
    }
  }, []);

  const enqueue = useCallback(
    (data: T, priority: 'critical' | 'high' | 'normal' | 'low' = 'normal') => {
      priorityQueue.current.push({
        data,
        priority,
        timestamp: Date.now(),
      });
      processQueue();
    },
    [processQueue]
  );

  return { latestUpdate, enqueue };
}

// Presence tracking with optimized updates
interface PresenceState {
  [key: string]: any[];
}

export function useRealtimePresence(channelName: string, userId: string, metadata?: Record<string, any>) {
  const [presenceState, setPresenceState] = useState<PresenceState>({});
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel(channelName);

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState() as unknown as PresenceState;
        setPresenceState(state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
            ...metadata,
          });
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [channelName, userId, metadata]);

  const onlineUsers = Object.values(presenceState).flat();

  return {
    presenceState,
    onlineUsers,
    onlineCount: onlineUsers.length,
  };
}

// Broadcast messages with deduplication
export function useRealtimeBroadcast<T>(channelName: string) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const messageIds = useRef(new Set<string>());

  const broadcast = useCallback(
    async (event: string, payload: T & { messageId?: string }) => {
      const channel = channelPool.get(channelName) || supabase.channel(channelName);

      // Add deduplication ID
      const messageId = payload.messageId || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      if (!channelPool.has(channelName)) {
        await channel.subscribe();
        channelPool.set(channelName, channel);
      }

      return channel.send({
        type: 'broadcast',
        event,
        payload: { ...payload, messageId },
      });
    },
    [channelName]
  );

  const subscribe = useCallback(
    (event: string, callback: (payload: T) => void) => {
      const channel = channelPool.get(channelName) || supabase.channel(channelName);

      channel.on('broadcast', { event }, ({ payload }) => {
        // Deduplicate messages
        const messageId = (payload as any)?.messageId;
        if (messageId && messageIds.current.has(messageId)) {
          return;
        }
        if (messageId) {
          messageIds.current.add(messageId);
          // Clean up old message IDs
          if (messageIds.current.size > 1000) {
            const idsArray = Array.from(messageIds.current);
            messageIds.current = new Set(idsArray.slice(-500));
          }
        }
        callback(payload as T);
      });

      if (!channelPool.has(channelName)) {
        channel.subscribe();
        channelPool.set(channelName, channel);
      }

      channelRef.current = channel;
    },
    [channelName]
  );

  useEffect(() => {
    return () => {
      if (channelRef.current) {
        releaseChannel(channelName);
      }
    };
  }, [channelName]);

  return { broadcast, subscribe };
}
