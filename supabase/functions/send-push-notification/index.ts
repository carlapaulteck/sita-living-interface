import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { userId, title, body, data, priority } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[Push] Sending notification to user ${userId}: ${title}`);

    // Get user's push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", userId);

    if (subError) {
      console.error("[Push] Error fetching subscriptions:", subError);
      throw subError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log("[Push] No push subscriptions found for user");
      return new Response(
        JSON.stringify({ success: false, message: "No push subscriptions found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check user's quiet hours and cognitive state
    const { data: preferences } = await supabase
      .from("user_preferences")
      .select("daily_rhythm, sensory_prefs")
      .eq("user_id", userId)
      .single();

    const { data: cognitiveState } = await supabase
      .from("cognitive_states")
      .select("state")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Check if should suppress notification
    const currentHour = new Date().getHours();
    const dailyRhythm = preferences?.daily_rhythm as { sleepTime?: string; wakeTime?: string } | null;
    
    if (dailyRhythm && priority !== "critical") {
      const sleepHour = dailyRhythm.sleepTime ? parseInt(dailyRhythm.sleepTime.split(":")[0]) : 22;
      const wakeHour = dailyRhythm.wakeTime ? parseInt(dailyRhythm.wakeTime.split(":")[0]) : 7;
      
      if ((currentHour >= sleepHour || currentHour < wakeHour)) {
        console.log("[Push] Suppressing notification during quiet hours");
        return new Response(
          JSON.stringify({ success: false, message: "Quiet hours - notification deferred" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Suppress non-critical during overload/hyperfocus
    if (cognitiveState?.state === "overload" || cognitiveState?.state === "hyperfocus") {
      if (priority !== "critical") {
        console.log(`[Push] Suppressing notification during ${cognitiveState.state} state`);
        return new Response(
          JSON.stringify({ success: false, message: `Deferred - user in ${cognitiveState.state} state` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Create in-app notification record
    const { data: notification, error: notifError } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        title,
        message: body,
        type: data?.type || "info",
        action_url: data?.actionUrl,
        priority: priority || "normal",
        metadata: data,
      })
      .select()
      .single();

    if (notifError) {
      console.error("[Push] Error creating notification:", notifError);
    }

    // In a production environment, you would send push notifications here
    // using a library like web-push with VAPID keys
    // For now, we just log and mark as sent
    
    console.log(`[Push] Created notification ${notification?.id} for ${subscriptions.length} subscriptions`);

    // Update notification with push status
    if (notification) {
      await supabase
        .from("notifications")
        .update({
          push_sent: true,
          push_sent_at: new Date().toISOString(),
        })
        .eq("id", notification.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        notificationId: notification?.id,
        subscriptionCount: subscriptions.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("[Push] Error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
