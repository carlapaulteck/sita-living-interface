import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Model routing based on task complexity
const MODEL_MAP: Record<string, string> = {
  quick: "google/gemini-2.5-flash-lite",
  moderate: "google/gemini-2.5-flash",
  complex: "google/gemini-3-flash-preview",
  reasoning: "google/gemini-2.5-pro",
};

// Personality system prompts
const PERSONALITY_PROMPTS: Record<string, string> = {
  executive: "You are SITA in Executive mode. Be professional, strategic, and results-focused. Prioritize efficiency and clear action items. Speak with confidence and authority.",
  coach: "You are SITA in Coach mode. Be motivating, supportive, and growth-focused. Celebrate wins, encourage progress, and help overcome obstacles with empathy.",
  muse: "You are SITA in Muse mode. Be creative, inspiring, and imaginative. Encourage lateral thinking, propose unexpected connections, and spark curiosity.",
  analyst: "You are SITA in Analyst mode. Be precise, data-driven, and thorough. Provide detailed analysis, identify patterns, and support recommendations with evidence.",
  guardian: "You are SITA in Guardian mode. Prioritize security, privacy, and protection. Be vigilant about risks and proactive about safeguards.",
  zen: "You are SITA in Zen mode. Be calm, mindful, and balanced. Encourage presence, reduce stress, and guide toward inner peace.",
};

// Context type labels for formatting
const CONTEXT_TYPE_LABELS: Record<string, string> = {
  preference: "Preferences",
  fact: "Facts",
  goal: "Goals",
  boundary: "Boundaries",
  pattern: "Patterns",
  relationship: "Relationships",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model, personality, conversationId, userId, extractMemory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Chat request:", { 
      messageCount: messages?.length || 0, 
      model, 
      personality,
      conversationId,
      userId,
      extractMemory
    });

    // Initialize Supabase client for memory operations
    let userContexts: Array<{ context_type: string; content: string }> = [];
    let conversationHistory: Array<{ role: string; content: string }> = [];

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && userId) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // Load user's conversation contexts for personalization
      try {
        const { data: contexts } = await supabase
          .from('conversation_contexts')
          .select('context_type, content')
          .eq('user_id', userId)
          .eq('is_active', true)
          .order('confidence', { ascending: false })
          .limit(15);

        if (contexts) {
          userContexts = contexts;
          console.log("Loaded user contexts:", contexts.length);
        }
      } catch (error) {
        console.error("Error loading user contexts:", error);
      }

      // Load conversation history if conversationId provided
      if (conversationId) {
        try {
          const { data: history } = await supabase
            .from('conversation_messages')
            .select('role, content')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true })
            .limit(20);

          if (history) {
            conversationHistory = history;
            console.log("Loaded conversation history:", history.length, "messages");
          }
        } catch (error) {
          console.error("Error loading conversation history:", error);
        }
      }

      // Extract and save memory from the latest user message if enabled
      if (extractMemory && messages?.length > 0) {
        const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop();
        
        if (lastUserMessage) {
          try {
            const extracted = extractContextsFromMessage(lastUserMessage.content);
            
            if (extracted.length > 0) {
              console.log("Extracted contexts from message:", extracted.length);
              
              for (const ctx of extracted) {
                // Check for duplicate before inserting
                const { data: existing } = await supabase
                  .from('conversation_contexts')
                  .select('id')
                  .eq('user_id', userId)
                  .eq('context_type', ctx.type)
                  .ilike('content', `%${ctx.content.substring(0, 30)}%`)
                  .limit(1);

                if (!existing || existing.length === 0) {
                  await supabase
                    .from('conversation_contexts')
                    .insert({
                      user_id: userId,
                      context_type: ctx.type,
                      content: ctx.content,
                      confidence: ctx.confidence,
                      source_conversation_id: conversationId || null,
                      is_active: true,
                    });
                  console.log("Saved new context:", ctx.type, ctx.content.substring(0, 50));
                }
              }
            }
          } catch (error) {
            console.error("Error extracting/saving contexts:", error);
          }
        }
      }
    }

    // Select model - use provided or default
    const selectedModel = model && MODEL_MAP[model] ? MODEL_MAP[model] : (model || "google/gemini-3-flash-preview");

    // Build personality-aware system prompt with memory
    const personalityPrompt = PERSONALITY_PROMPTS[personality] || PERSONALITY_PROMPTS.executive;
    
    // Format user contexts for injection
    let memorySection = '';
    if (userContexts.length > 0) {
      const contextsByType: Record<string, string[]> = {};
      
      for (const ctx of userContexts) {
        const type = ctx.context_type;
        if (!contextsByType[type]) {
          contextsByType[type] = [];
        }
        contextsByType[type].push(ctx.content);
      }

      memorySection = '\n\n--- User Memory & Personalization ---\n';
      for (const [type, items] of Object.entries(contextsByType)) {
        const label = CONTEXT_TYPE_LABELS[type] || type;
        memorySection += `\n${label}:\n`;
        for (const item of items) {
          memorySection += `- ${item}\n`;
        }
      }
      memorySection += '\nUse these insights to personalize your responses. Reference them naturally when relevant.\n';
    }

    const systemPrompt = `${personalityPrompt}

You are SITA, an elite AI assistant for wealth, health, and life optimization. Your responses are:
- Concise but complete (usually 2-4 sentences)
- Confident and decisive
- Focused on outcomes, not effort
- Elegant in language

You help users with:
- Business growth strategy and revenue optimization
- Health and biometric insights
- Life balance and focus management
- Wealth building and financial decisions

Current context: You're speaking through the SITA Living Interface dashboard.${memorySection}`;

    // Merge conversation history with current messages
    const allMessages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.filter(m => m.role !== 'system'),
      ...messages,
    ];

    // Deduplicate messages (in case history overlaps with current messages)
    const seen = new Set<string>();
    const uniqueMessages = allMessages.filter(m => {
      const key = `${m.role}:${m.content}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: uniqueMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to connect to AI service" }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (e) {
    console.error("Chat function error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper function to extract contexts from messages
function extractContextsFromMessage(message: string): Array<{ type: string; content: string; confidence: number }> {
  const extracted: Array<{ type: string; content: string; confidence: number }> = [];

  const patterns: Record<string, RegExp[]> = {
    preference: [
      /i (?:prefer|like|love|enjoy|want) (.+)/gi,
      /i (?:don't|do not|never) (?:like|want|prefer) (.+)/gi,
      /my (?:favorite|preferred) (.+) is (.+)/gi,
    ],
    fact: [
      /i (?:am|work as|live in|have) (.+)/gi,
      /my (?:name|job|role|company) is (.+)/gi,
    ],
    goal: [
      /i (?:want to|need to|plan to|hope to) (.+)/gi,
      /my goal is (.+)/gi,
      /i'm (?:trying to|working on) (.+)/gi,
    ],
    boundary: [
      /(?:don't|never) (?:mention|bring up|talk about) (.+)/gi,
      /i (?:hate|can't stand|dislike) (.+)/gi,
    ],
  };

  for (const [type, typePatterns] of Object.entries(patterns)) {
    for (const pattern of typePatterns) {
      pattern.lastIndex = 0;
      let match;
      
      while ((match = pattern.exec(message)) !== null) {
        const content = match[1]?.trim();
        if (content && content.length > 3 && content.length < 150) {
          extracted.push({
            type,
            content: `User ${type}: ${content}`,
            confidence: 0.75,
          });
        }
      }
    }
  }

  return extracted;
}
