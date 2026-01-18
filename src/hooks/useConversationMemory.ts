import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type ContextType = 'preference' | 'fact' | 'goal' | 'boundary' | 'pattern' | 'relationship';

export interface ConversationContext {
  id: string;
  user_id: string;
  context_type: ContextType;
  content: string;
  confidence: number;
  source_conversation_id: string | null;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export interface ExtractedContext {
  type: ContextType;
  content: string;
  confidence: number;
}

// Patterns to extract different context types from conversations
const EXTRACTION_PATTERNS = {
  preference: [
    /i (?:prefer|like|love|enjoy|want) (.+)/gi,
    /i (?:don't|do not|never) (?:like|want|prefer) (.+)/gi,
    /my (?:favorite|preferred) (.+) is (.+)/gi,
    /i'm a (.+) person/gi,
  ],
  fact: [
    /i (?:am|work as|live in|have) (.+)/gi,
    /my (?:name|job|role|company|age) is (.+)/gi,
    /i've been (.+) for (.+)/gi,
  ],
  goal: [
    /i (?:want to|need to|should|must|plan to|hope to) (.+)/gi,
    /my goal is (.+)/gi,
    /i'm (?:trying to|working on|aiming for) (.+)/gi,
  ],
  boundary: [
    /(?:don't|never) (?:mention|bring up|talk about) (.+)/gi,
    /i (?:hate|can't stand|dislike) (.+)/gi,
    /(?:please|don't) (?:remind|notify) me about (.+)/gi,
  ],
  pattern: [
    /i (?:usually|always|often|typically) (.+)/gi,
    /every (?:morning|evening|day|week) i (.+)/gi,
    /when i (.+), i (?:tend to|usually) (.+)/gi,
  ],
  relationship: [
    /my (?:wife|husband|partner|spouse|child|kids|family|friend|colleague|boss) (.+)/gi,
    /(?:wife|husband|partner|spouse|child|kids|family|friend|colleague) is (?:named|called) (.+)/gi,
  ],
};

export function useConversationMemory() {
  const { user } = useAuth();
  const [contexts, setContexts] = useState<ConversationContext[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load all active contexts for the user
  const loadContexts = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversation_contexts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('confidence', { ascending: false });

      if (error) throw error;
      setContexts((data as ConversationContext[]) || []);
    } catch (error) {
      console.error('Error loading contexts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Extract contexts from a conversation message
  const extractContextsFromMessage = useCallback((
    message: string,
    role: 'user' | 'assistant'
  ): ExtractedContext[] => {
    // Only extract from user messages
    if (role !== 'user') return [];

    const extracted: ExtractedContext[] = [];

    for (const [type, patterns] of Object.entries(EXTRACTION_PATTERNS)) {
      for (const pattern of patterns) {
        // Reset regex state
        pattern.lastIndex = 0;
        let match;
        
        while ((match = pattern.exec(message)) !== null) {
          const content = match[1]?.trim();
          if (content && content.length > 3 && content.length < 200) {
            extracted.push({
              type: type as ContextType,
              content: `${type === 'preference' ? 'User prefers: ' : 
                        type === 'fact' ? 'User fact: ' : 
                        type === 'goal' ? 'User goal: ' : 
                        type === 'boundary' ? 'User boundary: ' :
                        type === 'pattern' ? 'User pattern: ' :
                        'User relationship: '}${content}`,
              confidence: 0.7,
            });
          }
        }
      }
    }

    return extracted;
  }, []);

  // Save extracted contexts to database
  const saveContexts = useCallback(async (
    extractedContexts: ExtractedContext[],
    conversationId?: string
  ): Promise<void> => {
    if (!user || extractedContexts.length === 0) return;

    try {
      // Check for duplicates before inserting
      for (const ctx of extractedContexts) {
        // Look for similar existing context
        const { data: existing } = await supabase
          .from('conversation_contexts')
          .select('id, confidence')
          .eq('user_id', user.id)
          .eq('context_type', ctx.type)
          .ilike('content', `%${ctx.content.substring(0, 50)}%`)
          .limit(1);

        if (existing && existing.length > 0) {
          // Update confidence if it's higher
          if (ctx.confidence > (existing[0].confidence || 0)) {
            await supabase
              .from('conversation_contexts')
              .update({ confidence: ctx.confidence })
              .eq('id', existing[0].id);
          }
        } else {
          // Insert new context
          await supabase
            .from('conversation_contexts')
            .insert({
              user_id: user.id,
              context_type: ctx.type,
              content: ctx.content,
              confidence: ctx.confidence,
              source_conversation_id: conversationId || null,
              is_active: true,
            });
        }
      }

      // Reload contexts after save
      await loadContexts();
    } catch (error) {
      console.error('Error saving contexts:', error);
    }
  }, [user, loadContexts]);

  // Process a full conversation for context extraction
  const processConversation = useCallback(async (
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    conversationId?: string
  ): Promise<ExtractedContext[]> => {
    const allExtracted: ExtractedContext[] = [];

    for (const message of messages) {
      const extracted = extractContextsFromMessage(message.content, message.role);
      allExtracted.push(...extracted);
    }

    // Deduplicate
    const unique = allExtracted.filter((ctx, index, self) =>
      index === self.findIndex(t => t.content === ctx.content)
    );

    if (unique.length > 0) {
      await saveContexts(unique, conversationId);
    }

    return unique;
  }, [extractContextsFromMessage, saveContexts]);

  // Get contexts formatted for AI system prompt injection
  const getContextsForPrompt = useCallback((
    maxContexts: number = 10,
    types?: ContextType[]
  ): string => {
    let filtered = contexts;

    if (types && types.length > 0) {
      filtered = contexts.filter(ctx => types.includes(ctx.context_type as ContextType));
    }

    const topContexts = filtered.slice(0, maxContexts);

    if (topContexts.length === 0) return '';

    const contextsByType: Record<string, string[]> = {};

    for (const ctx of topContexts) {
      if (!contextsByType[ctx.context_type]) {
        contextsByType[ctx.context_type] = [];
      }
      contextsByType[ctx.context_type].push(ctx.content);
    }

    let prompt = '\n\n--- User Memory & Preferences ---\n';

    for (const [type, items] of Object.entries(contextsByType)) {
      prompt += `\n${type.charAt(0).toUpperCase() + type.slice(1)}s:\n`;
      for (const item of items) {
        prompt += `- ${item}\n`;
      }
    }

    prompt += '\nUse these insights to personalize your responses.\n';

    return prompt;
  }, [contexts]);

  // Add a manual context
  const addContext = useCallback(async (
    type: ContextType,
    content: string,
    confidence: number = 1.0
  ): Promise<void> => {
    if (!user) return;

    try {
      await supabase
        .from('conversation_contexts')
        .insert({
          user_id: user.id,
          context_type: type,
          content,
          confidence,
          is_active: true,
        });

      await loadContexts();
    } catch (error) {
      console.error('Error adding context:', error);
    }
  }, [user, loadContexts]);

  // Remove a context
  const removeContext = useCallback(async (contextId: string): Promise<void> => {
    if (!user) return;

    try {
      await supabase
        .from('conversation_contexts')
        .update({ is_active: false })
        .eq('id', contextId);

      setContexts(prev => prev.filter(ctx => ctx.id !== contextId));
    } catch (error) {
      console.error('Error removing context:', error);
    }
  }, [user]);

  // Update context content
  const updateContext = useCallback(async (
    contextId: string,
    content: string
  ): Promise<void> => {
    if (!user) return;

    try {
      await supabase
        .from('conversation_contexts')
        .update({ content })
        .eq('id', contextId);

      setContexts(prev =>
        prev.map(ctx =>
          ctx.id === contextId ? { ...ctx, content } : ctx
        )
      );
    } catch (error) {
      console.error('Error updating context:', error);
    }
  }, [user]);

  // Update context confidence
  const updateConfidence = useCallback(async (
    contextId: string,
    confidence: number
  ): Promise<void> => {
    if (!user) return;

    try {
      await supabase
        .from('conversation_contexts')
        .update({ confidence })
        .eq('id', contextId);

      setContexts(prev =>
        prev.map(ctx =>
          ctx.id === contextId ? { ...ctx, confidence } : ctx
        )
      );
    } catch (error) {
      console.error('Error updating confidence:', error);
    }
  }, [user]);

  // Semantic search through memories using AI
  const semanticSearch = useCallback(async (
    query: string,
    limit: number = 10
  ): Promise<Array<ConversationContext & { relevance_score?: number }>> => {
    if (!user || !query.trim()) return [];

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/semantic-memory-search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            query,
            userId: user.id,
            limit,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Semantic search failed");
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Semantic search error:", error);
      // Fallback to local keyword search
      const queryLower = query.toLowerCase();
      return contexts.filter(ctx => 
        ctx.content.toLowerCase().includes(queryLower)
      );
    }
  }, [user, contexts]);

  // Load contexts on mount
  useEffect(() => {
    loadContexts();
  }, [loadContexts]);

  return {
    contexts,
    isLoading,
    loadContexts,
    extractContextsFromMessage,
    saveContexts,
    processConversation,
    getContextsForPrompt,
    addContext,
    removeContext,
    updateContext,
    updateConfidence,
    semanticSearch,
  };
}
