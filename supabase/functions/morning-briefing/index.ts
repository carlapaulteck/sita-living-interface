import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[MorningBriefing] Generating briefing for user ${userId}`);

    // Get user preferences
    const { data: preferences } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    // Get user's name from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("user_id", userId)
      .single();

    // Get cognitive state
    const { data: cognitiveState } = await supabase
      .from("cognitive_states")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Get cognitive budget for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: budgetEntries } = await supabase
      .from("cognitive_budget_log")
      .select("domain, energy_cost")
      .eq("user_id", userId)
      .gte("created_at", today.toISOString());

    // Calculate remaining budget
    const spentByDomain: Record<string, number> = {};
    for (const entry of budgetEntries || []) {
      spentByDomain[entry.domain] = (spentByDomain[entry.domain] || 0) + Number(entry.energy_cost);
    }

    // Get pending notifications
    const { data: pendingNotifications } = await supabase
      .from("notifications")
      .select("title, type, created_at")
      .eq("user_id", userId)
      .eq("read", false)
      .limit(5);

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from("activity_feed")
      .select("title, event_type, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3);

    // Build briefing
    const userName = profile?.name || "there";
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening";

    const briefing = {
      greeting: `${greeting}, ${userName}`,
      timestamp: new Date().toISOString(),
      
      cognitiveInsight: cognitiveState ? {
        state: cognitiveState.state,
        confidence: cognitiveState.confidence,
        suggestion: getCognitiveSuggestion(cognitiveState.state),
      } : null,
      
      energyForecast: {
        totalBudget: 1.0,
        spent: Object.values(spentByDomain).reduce((a, b) => a + b, 0),
        byDomain: spentByDomain,
        recommendation: getEnergyRecommendation(spentByDomain),
      },
      
      pendingItems: {
        notificationCount: pendingNotifications?.length || 0,
        highlights: pendingNotifications?.slice(0, 3).map(n => n.title) || [],
      },
      
      recentWins: recentActivity?.filter(a => 
        a.event_type === "success" || a.event_type === "milestone"
      ).map(a => a.title) || [],
      
      focusWindows: preferences?.daily_rhythm?.focusBlocks || [],
      
      dailyIntention: generateDailyIntention(preferences, cognitiveState),
    };

    console.log("[MorningBriefing] Briefing generated successfully");

    return new Response(
      JSON.stringify(briefing),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[MorningBriefing] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getCognitiveSuggestion(state: string): string {
  const suggestions: Record<string, string> = {
    flow: "You're in a great mental state. Consider tackling your most important work now.",
    hyperfocus: "Deep focus detected. Protect this time - avoid context switches.",
    distracted: "Attention is scattered. A short walk or breathing exercise might help reset.",
    overload: "Cognitive load is high. Consider breaking tasks into smaller pieces.",
    fatigued: "Energy is low. This might be a good time for lighter administrative tasks.",
    recovery: "You're in recovery mode. Be gentle with yourself and prioritize rest.",
    neutral: "You're in a balanced state. A good time for varied work.",
  };
  return suggestions[state] || suggestions.neutral;
}

function getEnergyRecommendation(spent: Record<string, number>): string {
  const total = Object.values(spent).reduce((a, b) => a + b, 0);
  
  if (total < 0.2) {
    return "Full energy reserves. Great day for challenging work!";
  } else if (total < 0.5) {
    return "Good energy available. Pace yourself for sustained performance.";
  } else if (total < 0.8) {
    return "Energy is getting low. Prioritize essential tasks.";
  } else {
    return "Energy depleted. Focus on rest and recovery.";
  }
}

function generateDailyIntention(preferences: any, cognitiveState: any): string {
  const intents = preferences?.primary_intents || [];
  const state = cognitiveState?.state || "neutral";
  
  if (intents.includes("build-focus") && state === "distracted") {
    return "Today, let's rebuild focus with one deep work block.";
  } else if (intents.includes("improve-sleep") && state === "fatigued") {
    return "Prioritize rest today to support your sleep goals.";
  } else if (intents.includes("increase-income")) {
    return "Focus on high-value activities that move the needle.";
  }
  
  return "Stay present and make progress on what matters most.";
}
