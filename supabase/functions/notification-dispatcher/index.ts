import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  userId: string;
  title: string;
  message: string;
  type: string;
  priority?: "low" | "normal" | "high" | "critical";
  actionUrl?: string;
  data?: Record<string, unknown>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const notification: NotificationRequest = await req.json();

    if (!notification.userId || !notification.title) {
      return new Response(
        JSON.stringify({ error: "userId and title are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[Dispatcher] Processing notification for user ${notification.userId}`);

    // Get user's cognitive state and preferences
    const [cognitiveResult, preferencesResult, subscriptionsResult] = await Promise.all([
      supabase
        .from("cognitive_states")
        .select("state, confidence")
        .eq("user_id", notification.userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from("user_preferences")
        .select("daily_rhythm, sensory_prefs, friction_profile")
        .eq("user_id", notification.userId)
        .single(),
      supabase
        .from("push_subscriptions")
        .select("id")
        .eq("user_id", notification.userId),
    ]);

    const cognitiveState = cognitiveResult.data?.state || "neutral";
    const preferences = preferencesResult.data;
    const hasPushSubscription = (subscriptionsResult.data?.length || 0) > 0;

    // Determine delivery modality
    const modality = determineModality({
      priority: notification.priority || "normal",
      cognitiveState,
      preferences,
      hasPushSubscription,
    });

    console.log(`[Dispatcher] Selected modality: ${modality}`);

    // Create notification record
    const { data: notifRecord, error: notifError } = await supabase
      .from("notifications")
      .insert({
        user_id: notification.userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        action_url: notification.actionUrl,
        priority: notification.priority || "normal",
        metadata: {
          ...notification.data,
          modality,
          cognitive_state_at_dispatch: cognitiveState,
        },
      })
      .select()
      .single();

    if (notifError) {
      console.error("[Dispatcher] Error creating notification:", notifError);
      throw notifError;
    }

    // If push modality is selected and we have subscriptions, trigger push
    if (modality === "push" && hasPushSubscription) {
      // Call the send-push-notification function
      const pushResponse = await fetch(
        `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-push-notification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({
            userId: notification.userId,
            title: notification.title,
            body: notification.message,
            data: notification.data,
            priority: notification.priority,
          }),
        }
      );

      const pushResult = await pushResponse.json();
      console.log("[Dispatcher] Push notification result:", pushResult);
    }

    return new Response(
      JSON.stringify({
        success: true,
        notificationId: notifRecord?.id,
        modality,
        delivered: true,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("[Dispatcher] Error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

interface ModalityDecision {
  priority: string;
  cognitiveState: string;
  preferences: any;
  hasPushSubscription: boolean;
}

function determineModality(params: ModalityDecision): "push" | "in-app" | "silent" | "batch" {
  const { priority, cognitiveState, preferences, hasPushSubscription } = params;

  // Critical always gets push if available
  if (priority === "critical" && hasPushSubscription) {
    return "push";
  }

  // During hyperfocus or flow, only critical gets through
  if (cognitiveState === "hyperfocus" || cognitiveState === "flow") {
    if (priority === "critical") {
      return hasPushSubscription ? "push" : "in-app";
    }
    return "batch"; // Batch non-critical for later
  }

  // During overload, minimize interruptions
  if (cognitiveState === "overload") {
    if (priority === "critical") {
      return "in-app"; // Even critical uses gentler in-app
    }
    return "silent"; // Just log, don't notify
  }

  // Check quiet hours
  const currentHour = new Date().getHours();
  const dailyRhythm = preferences?.daily_rhythm as { sleepTime?: string; wakeTime?: string } | null;
  
  if (dailyRhythm) {
    const sleepHour = dailyRhythm.sleepTime ? parseInt(dailyRhythm.sleepTime.split(":")[0]) : 22;
    const wakeHour = dailyRhythm.wakeTime ? parseInt(dailyRhythm.wakeTime.split(":")[0]) : 7;
    
    if (currentHour >= sleepHour || currentHour < wakeHour) {
      if (priority !== "critical") {
        return "batch";
      }
    }
  }

  // Check user's friction profile for alert preferences
  const frictionProfile = preferences?.friction_profile as { alertFrequency?: string } | null;
  
  if (frictionProfile?.alertFrequency === "critical-only") {
    if (priority !== "critical" && priority !== "high") {
      return "batch";
    }
  }

  // Normal delivery
  if (priority === "high" && hasPushSubscription) {
    return "push";
  }

  return "in-app";
}
