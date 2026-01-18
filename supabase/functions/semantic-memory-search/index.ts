import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, userId, limit = 10 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    if (!query || !userId) {
      throw new Error("Missing required parameters: query and userId");
    }

    console.log("Semantic memory search:", { query, userId, limit });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get all active contexts for the user
    const { data: contexts, error: fetchError } = await supabase
      .from('conversation_contexts')
      .select('id, context_type, content, confidence, created_at')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (fetchError) throw fetchError;

    if (!contexts || contexts.length === 0) {
      return new Response(
        JSON.stringify({ results: [], message: "No memories found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use AI to rank memories by semantic relevance to the query
    const rankingPrompt = `You are a semantic similarity analyzer. Given a search query and a list of user memories, rank the memories by relevance to the query.

Search Query: "${query}"

Memories to rank:
${contexts.map((ctx, i) => `${i + 1}. [${ctx.context_type}] ${ctx.content}`).join('\n')}

Return a JSON array of memory indices (1-based) ordered by relevance, most relevant first. Only include memories with >30% relevance.
Example response: {"relevant_indices": [3, 1, 5], "relevance_scores": [0.95, 0.72, 0.45]}

Respond ONLY with valid JSON, no explanation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "user", content: rankingPrompt }
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      console.error("AI ranking failed, falling back to keyword search");
      // Fallback to simple keyword matching
      const queryLower = query.toLowerCase();
      const keywordResults = contexts
        .filter(ctx => ctx.content.toLowerCase().includes(queryLower))
        .slice(0, limit);
      
      return new Response(
        JSON.stringify({ 
          results: keywordResults,
          searchType: "keyword_fallback"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const rankingContent = aiResponse.choices?.[0]?.message?.content;

    let ranking: { relevant_indices: number[]; relevance_scores: number[] };
    try {
      ranking = JSON.parse(rankingContent);
    } catch {
      console.error("Failed to parse AI ranking response:", rankingContent);
      // Fallback to returning all contexts
      return new Response(
        JSON.stringify({ 
          results: contexts.slice(0, limit),
          searchType: "no_ranking"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map indices to actual contexts with relevance scores
    const rankedResults = ranking.relevant_indices
      .slice(0, limit)
      .map((index, i) => {
        const ctx = contexts[index - 1]; // Convert 1-based to 0-based
        if (!ctx) return null;
        return {
          ...ctx,
          relevance_score: ranking.relevance_scores?.[i] || 0.5,
        };
      })
      .filter(Boolean);

    console.log("Semantic search results:", rankedResults.length);

    return new Response(
      JSON.stringify({ 
        results: rankedResults,
        searchType: "semantic",
        totalMemories: contexts.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (e) {
    console.error("Semantic memory search error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
