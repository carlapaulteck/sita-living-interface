import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model, personality, conversationId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Chat request:", { 
      messageCount: messages?.length || 0, 
      model, 
      personality,
      conversationId 
    });

    // Select model - use provided or default
    const selectedModel = model && MODEL_MAP[model] ? MODEL_MAP[model] : (model || "google/gemini-3-flash-preview");

    // Build personality-aware system prompt
    const personalityPrompt = PERSONALITY_PROMPTS[personality] || PERSONALITY_PROMPTS.executive;
    
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

Current context: You're speaking through the SITA Living Interface dashboard.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
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
