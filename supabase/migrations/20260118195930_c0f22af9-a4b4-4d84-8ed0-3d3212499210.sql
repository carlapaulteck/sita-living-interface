-- Create conversations table for storing chat sessions
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT,
  summary TEXT,
  personality_mode TEXT DEFAULT 'executive',
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  archived_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- RLS policies for conversations
CREATE POLICY "Users can view own conversations"
ON public.conversations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
ON public.conversations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
ON public.conversations FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
ON public.conversations FOR DELETE
USING (auth.uid() = user_id);

-- Create conversation_messages table
CREATE TABLE public.conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  sentiment TEXT,
  cognitive_state TEXT,
  model_used TEXT,
  tokens_used INTEGER,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for conversation_messages
CREATE POLICY "Users can view own messages"
ON public.conversation_messages FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own messages"
ON public.conversation_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
ON public.conversation_messages FOR DELETE
USING (auth.uid() = user_id);

-- Create conversation_contexts table for long-term memory
CREATE TABLE public.conversation_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  context_type TEXT NOT NULL CHECK (context_type IN ('preference', 'fact', 'goal', 'boundary', 'learned')),
  content TEXT NOT NULL,
  confidence REAL DEFAULT 1.0,
  source_conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.conversation_contexts ENABLE ROW LEVEL SECURITY;

-- RLS policies for conversation_contexts
CREATE POLICY "Users can view own contexts"
ON public.conversation_contexts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own contexts"
ON public.conversation_contexts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contexts"
ON public.conversation_contexts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contexts"
ON public.conversation_contexts FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON public.conversations(updated_at DESC);
CREATE INDEX idx_conversation_messages_conversation_id ON public.conversation_messages(conversation_id);
CREATE INDEX idx_conversation_messages_created_at ON public.conversation_messages(created_at DESC);
CREATE INDEX idx_conversation_contexts_user_id ON public.conversation_contexts(user_id);
CREATE INDEX idx_conversation_contexts_type ON public.conversation_contexts(context_type);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_messages;

-- Create trigger for updating conversation updated_at
CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();