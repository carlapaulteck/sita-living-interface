import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Conversation {
  id: string;
  title: string | null;
  summary: string | null;
  personality_mode: string;
  message_count: number;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
  metadata: Record<string, unknown>;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sentiment: string | null;
  cognitive_state: string | null;
  model_used: string | null;
  tokens_used: number | null;
  latency_ms: number | null;
  created_at: string;
  metadata: Record<string, unknown>;
}

export function useConversationHistory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load all conversations for user
  const loadConversations = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .is('archived_at', null)
        .order('updated_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setConversations((data as Conversation[]) || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversation_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data as ConversationMessage[]) || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, [user]);

  // Create a new conversation
  const createConversation = useCallback(async (
    personalityMode: string = 'executive',
    title?: string
  ): Promise<Conversation | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: title || `Conversation ${new Date().toLocaleDateString()}`,
          personality_mode: personalityMode,
        })
        .select()
        .single();

      if (error) throw error;
      
      const conversation = data as Conversation;
      setCurrentConversation(conversation);
      setConversations(prev => [conversation, ...prev]);
      setMessages([]);
      
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create conversation',
        variant: 'destructive',
      });
      return null;
    }
  }, [user, toast]);

  // Add a message to current conversation
  const addMessage = useCallback(async (
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: {
      sentiment?: string;
      cognitive_state?: string;
      model_used?: string;
      tokens_used?: number;
      latency_ms?: number;
    }
  ): Promise<ConversationMessage | null> => {
    if (!user || !currentConversation) return null;

    try {
      const { data, error } = await supabase
        .from('conversation_messages')
        .insert({
          conversation_id: currentConversation.id,
          user_id: user.id,
          role,
          content,
          sentiment: metadata?.sentiment,
          cognitive_state: metadata?.cognitive_state,
          model_used: metadata?.model_used,
          tokens_used: metadata?.tokens_used,
          latency_ms: metadata?.latency_ms,
        })
        .select()
        .single();

      if (error) throw error;

      const message = data as ConversationMessage;
      setMessages(prev => [...prev, message]);

      // Update conversation message count
      await supabase
        .from('conversations')
        .update({ 
          message_count: currentConversation.message_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentConversation.id);

      return message;
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  }, [user, currentConversation]);

  // Switch to a different conversation
  const switchConversation = useCallback(async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
      await loadMessages(conversationId);
    }
  }, [conversations, loadMessages]);

  // Archive a conversation
  const archiveConversation = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('conversations')
        .update({ archived_at: new Date().toISOString() })
        .eq('id', conversationId);

      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }

      toast({
        title: 'Conversation archived',
        description: 'You can restore it from the archives.',
      });
    } catch (error) {
      console.error('Error archiving conversation:', error);
    }
  }, [user, currentConversation, toast]);

  // Update conversation title
  const updateTitle = useCallback(async (conversationId: string, title: string) => {
    if (!user) return;

    try {
      await supabase
        .from('conversations')
        .update({ title })
        .eq('id', conversationId);

      setConversations(prev => 
        prev.map(c => c.id === conversationId ? { ...c, title } : c)
      );

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(prev => prev ? { ...prev, title } : null);
      }
    } catch (error) {
      console.error('Error updating title:', error);
    }
  }, [user, currentConversation]);

  // Search conversations
  const searchConversations = useCallback(async (query: string): Promise<Conversation[]> => {
    if (!user || !query.trim()) return conversations;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .is('archived_at', null)
        .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data as Conversation[]) || [];
    } catch (error) {
      console.error('Error searching conversations:', error);
      return [];
    }
  }, [user, conversations]);

  // Get messages formatted for AI context
  const getMessagesForContext = useCallback((limit: number = 10) => {
    return messages.slice(-limit).map(m => ({
      role: m.role,
      content: m.content,
    }));
  }, [messages]);

  // Subscribe to new messages in realtime
  useEffect(() => {
    if (!currentConversation) return;

    const channel = supabase
      .channel(`conversation-${currentConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_messages',
          filter: `conversation_id=eq.${currentConversation.id}`,
        },
        (payload) => {
          const newMessage = payload.new as ConversationMessage;
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentConversation]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    loadConversations,
    createConversation,
    addMessage,
    switchConversation,
    archiveConversation,
    updateTitle,
    searchConversations,
    getMessagesForContext,
  };
}
