import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOrchestrator } from '@/lib/cognitiveOrchestrator';
import { useConversationHistory, ConversationMessage } from './useConversationHistory';
import { usePersonality } from '@/contexts/PersonalityContext';

export type TaskComplexity = 'quick' | 'moderate' | 'complex' | 'reasoning';

interface ChatOptions {
  priority?: 'critical' | 'high' | 'medium' | 'low';
  useCache?: boolean;
  streamResponse?: boolean;
}

interface ChatResult {
  content: string;
  model: string;
  latency: number;
  cached: boolean;
}

// Classify task complexity based on message content
function classifyTaskComplexity(message: string): TaskComplexity {
  const lowercaseMessage = message.toLowerCase();
  const wordCount = message.split(/\s+/).length;
  
  // Quick responses - simple queries
  if (wordCount < 10 && !lowercaseMessage.includes('why') && !lowercaseMessage.includes('how')) {
    return 'quick';
  }
  
  // Complex reasoning indicators
  const reasoningKeywords = [
    'analyze', 'strategy', 'plan', 'compare', 'evaluate',
    'optimize', 'design', 'architect', 'debug', 'solve',
    'explain why', 'think through', 'reason about'
  ];
  
  if (reasoningKeywords.some(k => lowercaseMessage.includes(k))) {
    return 'reasoning';
  }
  
  // Complex content generation
  const complexKeywords = [
    'write', 'create', 'generate', 'compose', 'draft',
    'implement', 'build', 'develop'
  ];
  
  if (complexKeywords.some(k => lowercaseMessage.includes(k)) && wordCount > 20) {
    return 'complex';
  }
  
  return 'moderate';
}

// Select model based on task complexity
function selectModel(complexity: TaskComplexity): string {
  const modelMap: Record<TaskComplexity, string> = {
    quick: 'google/gemini-2.5-flash-lite',
    moderate: 'google/gemini-2.5-flash',
    complex: 'google/gemini-3-flash-preview',
    reasoning: 'google/gemini-2.5-pro',
  };
  
  return modelMap[complexity];
}

// Generate cache key for message
function generateCacheKey(message: string, context: string): string {
  const normalized = message.toLowerCase().trim();
  return `chat:${normalized.substring(0, 100)}:${context.substring(0, 50)}`;
}

export function useOrchestratedChat() {
  const orchestrator = useOrchestrator();
  const { currentMode, config: personalityConfig } = usePersonality();
  const { 
    currentConversation, 
    messages, 
    addMessage, 
    createConversation,
    getMessagesForContext 
  } = useConversationHistory();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [lastLatency, setLastLatency] = useState<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Send message through orchestrated pipeline
  const sendMessage = useCallback(async (
    userMessage: string,
    options: ChatOptions = {}
  ): Promise<ChatResult | null> => {
    const { priority = 'medium', useCache = true, streamResponse = true } = options;
    
    setIsProcessing(true);
    setStreamingContent('');
    const startTime = Date.now();
    
    try {
      // Ensure we have a conversation
      let conversationId = currentConversation?.id;
      if (!conversationId) {
        const newConv = await createConversation(currentMode);
        conversationId = newConv?.id;
        if (!conversationId) throw new Error('Failed to create conversation');
      }
      
      // Classify task and select model
      const complexity = classifyTaskComplexity(userMessage);
      const model = selectModel(complexity);
      
      // Check cache for quick responses
      const cacheKey = generateCacheKey(userMessage, currentMode);
      if (useCache && complexity === 'quick') {
        const cached = orchestrator.getCachedData<string>(cacheKey);
        if (cached) {
          const latency = Date.now() - startTime;
          setLastLatency(latency);
          
          // Still save to history
          await addMessage('user', userMessage);
          await addMessage('assistant', cached, {
            model_used: 'cache',
            latency_ms: latency,
          });
          
          setIsProcessing(false);
          return { content: cached, model: 'cache', latency, cached: true };
        }
      }
      
      // Save user message
      await addMessage('user', userMessage);
      
      // Get context from previous messages
      const contextMessages = getMessagesForContext(10);
      
      // Build messages array for API
      const apiMessages = [
        ...contextMessages,
        { role: 'user' as const, content: userMessage }
      ];
      
      // Submit to orchestrator for prioritization
      if (priority === 'critical' || priority === 'high') {
        orchestrator.triggerPrefetch('high_priority_chat');
      }
      
      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();
      
      // Call the chat edge function
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          messages: apiMessages,
          model,
          personality: currentMode,
          conversationId,
        },
      });
      
      if (error) throw error;
      
      // Handle streaming or complete response
      let fullContent = '';
      
      if (data && typeof data === 'object' && 'body' in data) {
        // Streaming response
        const reader = (data as Response).body?.getReader();
        const decoder = new TextDecoder();
        
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const jsonStr = line.slice(6);
                if (jsonStr === '[DONE]') continue;
                
                try {
                  const parsed = JSON.parse(jsonStr);
                  const content = parsed.choices?.[0]?.delta?.content || '';
                  fullContent += content;
                  setStreamingContent(fullContent);
                } catch {
                  // Skip invalid JSON
                }
              }
            }
          }
        }
      } else if (typeof data === 'string') {
        fullContent = data;
        setStreamingContent(fullContent);
      } else {
        fullContent = data?.content || data?.message || JSON.stringify(data);
        setStreamingContent(fullContent);
      }
      
      const latency = Date.now() - startTime;
      setLastLatency(latency);
      
      // Save assistant response
      await addMessage('assistant', fullContent, {
        model_used: model,
        latency_ms: latency,
      });
      
      // Cache quick responses
      if (complexity === 'quick' && fullContent.length < 500) {
        orchestrator.cacheData(cacheKey, fullContent, 'warm');
      }
      
      setIsProcessing(false);
      return { content: fullContent, model, latency, cached: false };
      
    } catch (error) {
      console.error('Chat error:', error);
      setIsProcessing(false);
      return null;
    }
  }, [
    orchestrator, 
    currentConversation, 
    currentMode, 
    createConversation, 
    addMessage, 
    getMessagesForContext
  ]);

  // Cancel ongoing request
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsProcessing(false);
      setStreamingContent('');
    }
  }, []);

  // Get orchestrator stats
  const getStats = useCallback(() => {
    return {
      queueStatus: orchestrator.getQueueStatus(),
      cacheStats: orchestrator.getCacheStats(),
      lastLatency,
    };
  }, [orchestrator, lastLatency]);

  return {
    sendMessage,
    cancelRequest,
    isProcessing,
    streamingContent,
    lastLatency,
    messages,
    currentConversation,
    getStats,
    classifyComplexity: classifyTaskComplexity,
  };
}
