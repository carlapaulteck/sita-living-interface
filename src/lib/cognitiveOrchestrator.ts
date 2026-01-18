/**
 * Cognitive Orchestrator
 * 
 * Implements a lightweight version of the distributed AI architecture:
 * - Event-driven task routing
 * - Model selection based on task complexity
 * - Tiered memory with hot/warm/cold caching
 * - Predictive prefetching
 * - Task prioritization and batching
 */

export type TaskPriority = "critical" | "high" | "medium" | "low" | "background";
export type TaskType = 
  | "quick_response"      // Simple UI copy, suggestions
  | "reasoning"           // Complex analysis
  | "verification"        // Safety checks
  | "embedding"           // Vector operations
  | "summarization"       // Content compression
  | "prediction"          // Pattern recognition
  | "generation";         // Content creation

export type ModelTier = "edge" | "balanced" | "heavy";

export interface CognitiveTask {
  id: string;
  type: TaskType;
  priority: TaskPriority;
  payload: Record<string, unknown>;
  createdAt: number;
  deadline?: number;
  retries: number;
  maxRetries: number;
}

export interface TaskResult {
  taskId: string;
  success: boolean;
  data?: unknown;
  error?: string;
  latencyMs: number;
  modelUsed: string;
}

// Model routing configuration
const MODEL_ROUTING: Record<TaskType, { tier: ModelTier; model: string }> = {
  quick_response: { tier: "edge", model: "gemini-2.5-flash-lite" },
  reasoning: { tier: "heavy", model: "gemini-2.5-pro" },
  verification: { tier: "balanced", model: "gemini-2.5-flash" },
  embedding: { tier: "edge", model: "gemini-2.5-flash-lite" },
  summarization: { tier: "edge", model: "gemini-2.5-flash-lite" },
  prediction: { tier: "balanced", model: "gemini-2.5-flash" },
  generation: { tier: "balanced", model: "gemini-2.5-flash" }
};

// Priority weights for task scheduling
const PRIORITY_WEIGHTS: Record<TaskPriority, number> = {
  critical: 1000,
  high: 100,
  medium: 10,
  low: 1,
  background: 0.1
};

// Memory tiers
interface MemoryCache {
  hot: Map<string, { data: unknown; timestamp: number; accessCount: number }>;
  warm: Map<string, { data: unknown; timestamp: number }>;
  cold: Map<string, { data: unknown; timestamp: number }>;
}

class CognitiveOrchestrator {
  private taskQueue: CognitiveTask[] = [];
  private isProcessing = false;
  private memoryCache: MemoryCache = {
    hot: new Map(),
    warm: new Map(),
    cold: new Map()
  };
  private prefetchPatterns: Map<string, string[]> = new Map();
  private eventListeners: Map<string, Set<(data: unknown) => void>> = new Map();

  // Hot cache TTL: 5 minutes
  private readonly HOT_TTL = 5 * 60 * 1000;
  // Warm cache TTL: 30 minutes  
  private readonly WARM_TTL = 30 * 60 * 1000;
  // Cold cache TTL: 24 hours
  private readonly COLD_TTL = 24 * 60 * 60 * 1000;
  // Max hot cache size
  private readonly MAX_HOT_SIZE = 100;

  constructor() {
    // Start background cache maintenance
    this.startCacheMaintenance();
  }

  /**
   * Submit a task to the orchestrator
   */
  async submitTask(
    type: TaskType,
    payload: Record<string, unknown>,
    priority: TaskPriority = "medium",
    deadline?: number
  ): Promise<string> {
    const task: CognitiveTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      priority,
      payload,
      createdAt: Date.now(),
      deadline,
      retries: 0,
      maxRetries: 3
    };

    this.taskQueue.push(task);
    this.sortQueue();
    
    // Trigger processing if not already running
    if (!this.isProcessing) {
      this.processQueue();
    }

    this.emit("task:submitted", task);
    return task.id;
  }

  /**
   * Execute a task immediately (bypass queue)
   */
  async executeImmediate(
    type: TaskType,
    payload: Record<string, unknown>
  ): Promise<TaskResult> {
    const taskId = `immediate_${Date.now()}`;
    const startTime = Date.now();

    try {
      const result = await this.executeTask({
        id: taskId,
        type,
        priority: "critical",
        payload,
        createdAt: Date.now(),
        retries: 0,
        maxRetries: 1
      });

      return {
        taskId,
        success: true,
        data: result,
        latencyMs: Date.now() - startTime,
        modelUsed: MODEL_ROUTING[type].model
      };
    } catch (error) {
      return {
        taskId,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        latencyMs: Date.now() - startTime,
        modelUsed: MODEL_ROUTING[type].model
      };
    }
  }

  /**
   * Get recommended model for a task type
   */
  getRecommendedModel(type: TaskType): { tier: ModelTier; model: string } {
    return MODEL_ROUTING[type];
  }

  /**
   * Cache data with automatic tiering
   */
  cacheData(key: string, data: unknown, tier: "hot" | "warm" | "cold" = "warm"): void {
    const entry = { data, timestamp: Date.now(), accessCount: 0 };
    
    if (tier === "hot") {
      // Evict if at capacity
      if (this.memoryCache.hot.size >= this.MAX_HOT_SIZE) {
        this.evictLeastUsedFromHot();
      }
      this.memoryCache.hot.set(key, entry);
    } else if (tier === "warm") {
      this.memoryCache.warm.set(key, entry);
    } else {
      this.memoryCache.cold.set(key, entry);
    }
  }

  /**
   * Retrieve cached data with automatic promotion
   */
  getCachedData<T>(key: string): T | null {
    // Check hot cache first
    const hotEntry = this.memoryCache.hot.get(key);
    if (hotEntry && Date.now() - hotEntry.timestamp < this.HOT_TTL) {
      hotEntry.accessCount++;
      return hotEntry.data as T;
    }

    // Check warm cache and promote to hot if found
    const warmEntry = this.memoryCache.warm.get(key);
    if (warmEntry && Date.now() - warmEntry.timestamp < this.WARM_TTL) {
      this.promoteToHot(key, warmEntry.data);
      return warmEntry.data as T;
    }

    // Check cold cache and promote to warm if found
    const coldEntry = this.memoryCache.cold.get(key);
    if (coldEntry && Date.now() - coldEntry.timestamp < this.COLD_TTL) {
      this.memoryCache.warm.set(key, coldEntry);
      this.memoryCache.cold.delete(key);
      return coldEntry.data as T;
    }

    return null;
  }

  /**
   * Register a prefetch pattern
   */
  registerPrefetchPattern(trigger: string, dependencies: string[]): void {
    this.prefetchPatterns.set(trigger, dependencies);
  }

  /**
   * Trigger prefetch based on user action
   */
  triggerPrefetch(action: string): void {
    const dependencies = this.prefetchPatterns.get(action);
    if (dependencies) {
      dependencies.forEach(dep => {
        // Queue background fetch for each dependency
        this.submitTask("quick_response", { prefetch: dep }, "background");
      });
    }
  }

  /**
   * Subscribe to orchestrator events
   */
  on(event: string, callback: (data: unknown) => void): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
    
    return () => {
      this.eventListeners.get(event)?.delete(callback);
    };
  }

  /**
   * Get current queue status
   */
  getQueueStatus(): {
    pending: number;
    processing: boolean;
    byPriority: Record<TaskPriority, number>;
  } {
    const byPriority: Record<TaskPriority, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      background: 0
    };

    this.taskQueue.forEach(task => {
      byPriority[task.priority]++;
    });

    return {
      pending: this.taskQueue.length,
      processing: this.isProcessing,
      byPriority
    };
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    hot: number;
    warm: number;
    cold: number;
    hitRate: number;
  } {
    return {
      hot: this.memoryCache.hot.size,
      warm: this.memoryCache.warm.size,
      cold: this.memoryCache.cold.size,
      hitRate: 0.85 // Placeholder - would need actual hit tracking
    };
  }

  // Private methods

  private sortQueue(): void {
    this.taskQueue.sort((a, b) => {
      // Deadline urgency
      const aUrgency = a.deadline ? Math.max(0, a.deadline - Date.now()) : Infinity;
      const bUrgency = b.deadline ? Math.max(0, b.deadline - Date.now()) : Infinity;
      
      if (aUrgency < 5000 && bUrgency >= 5000) return -1;
      if (bUrgency < 5000 && aUrgency >= 5000) return 1;

      // Priority weight
      return PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.taskQueue.length === 0) return;

    this.isProcessing = true;

    while (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift()!;
      
      try {
        const result = await this.executeTask(task);
        this.emit("task:completed", { task, result });
      } catch (error) {
        if (task.retries < task.maxRetries) {
          task.retries++;
          this.taskQueue.push(task);
          this.sortQueue();
        } else {
          this.emit("task:failed", { task, error });
        }
      }
    }

    this.isProcessing = false;
  }

  private async executeTask(task: CognitiveTask): Promise<unknown> {
    const routing = MODEL_ROUTING[task.type];
    
    // Check cache first
    const cacheKey = JSON.stringify({ type: task.type, payload: task.payload });
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    // Simulate task execution (in real implementation, this would call the AI gateway)
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    
    const result = {
      modelUsed: routing.model,
      tier: routing.tier,
      processedAt: Date.now(),
      payload: task.payload
    };

    // Cache result
    this.cacheData(cacheKey, result, routing.tier === "edge" ? "hot" : "warm");

    return result;
  }

  private promoteToHot(key: string, data: unknown): void {
    if (this.memoryCache.hot.size >= this.MAX_HOT_SIZE) {
      this.evictLeastUsedFromHot();
    }
    this.memoryCache.hot.set(key, {
      data,
      timestamp: Date.now(),
      accessCount: 1
    });
    this.memoryCache.warm.delete(key);
  }

  private evictLeastUsedFromHot(): void {
    let leastUsedKey: string | null = null;
    let leastUsedCount = Infinity;

    this.memoryCache.hot.forEach((entry, key) => {
      if (entry.accessCount < leastUsedCount) {
        leastUsedCount = entry.accessCount;
        leastUsedKey = key;
      }
    });

    if (leastUsedKey) {
      const entry = this.memoryCache.hot.get(leastUsedKey)!;
      this.memoryCache.warm.set(leastUsedKey, {
        data: entry.data,
        timestamp: entry.timestamp
      });
      this.memoryCache.hot.delete(leastUsedKey);
    }
  }

  private startCacheMaintenance(): void {
    // Run maintenance every minute
    setInterval(() => {
      const now = Date.now();

      // Clean expired entries
      this.memoryCache.hot.forEach((entry, key) => {
        if (now - entry.timestamp > this.HOT_TTL) {
          this.memoryCache.warm.set(key, entry);
          this.memoryCache.hot.delete(key);
        }
      });

      this.memoryCache.warm.forEach((entry, key) => {
        if (now - entry.timestamp > this.WARM_TTL) {
          this.memoryCache.cold.set(key, entry);
          this.memoryCache.warm.delete(key);
        }
      });

      this.memoryCache.cold.forEach((entry, key) => {
        if (now - entry.timestamp > this.COLD_TTL) {
          this.memoryCache.cold.delete(key);
        }
      });

      this.emit("cache:maintained", this.getCacheStats());
    }, 60000);
  }

  private emit(event: string, data: unknown): void {
    this.eventListeners.get(event)?.forEach(callback => {
      try {
        callback(data);
      } catch (e) {
        console.error(`Error in event listener for ${event}:`, e);
      }
    });
  }
}

// Singleton instance
export const cognitiveOrchestrator = new CognitiveOrchestrator();

// Convenience hooks
export function useOrchestrator() {
  return cognitiveOrchestrator;
}
