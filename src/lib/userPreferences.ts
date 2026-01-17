import { supabase } from "@/integrations/supabase/client";
import { OnboardingData } from "@/types/onboarding";

// Convert OnboardingData to database format
function toDbFormat(data: OnboardingData): Record<string, unknown> {
  return {
    setup_mode: data.setupMode,
    primary_intents: data.primaryIntents,
    north_star_metrics: data.northStarMetrics,
    assistant_style: data.assistantStyle,
    friction_profile: JSON.parse(JSON.stringify(data.frictionProfile)),
    voice_profile: JSON.parse(JSON.stringify(data.voiceProfile)),
    sensory_prefs: JSON.parse(JSON.stringify(data.sensoryPrefs)),
    daily_rhythm: JSON.parse(JSON.stringify(data.dailyRhythm)),
    calendar_connected: data.calendarConnected,
    integrations: JSON.parse(JSON.stringify(data.integrations)),
    wealth_profile: data.wealthProfile ? JSON.parse(JSON.stringify(data.wealthProfile)) : null,
    health_profile: data.healthProfile ? JSON.parse(JSON.stringify(data.healthProfile)) : null,
    focus_profile: data.focusProfile ? JSON.parse(JSON.stringify(data.focusProfile)) : null,
    sovereignty_profile: JSON.parse(JSON.stringify(data.sovereigntyProfile)),
    autonomy_level: data.autonomyLevel,
    guardrails: JSON.parse(JSON.stringify(data.guardrails)),
    automations: JSON.parse(JSON.stringify(data.automations)),
    avatar_style: data.avatarStyle,
    presence_style: data.presenceStyle,
    signature_phrase: data.signaturePhrase,
    morning_ritual: data.morningRitual,
    theme: data.theme,
    onboarding_version: data.onboardingVersion,
    completed_at: data.completedAt,
  };
}

// Convert database format to OnboardingData
function fromDbFormat(row: Record<string, any>): Partial<OnboardingData> {
  return {
    setupMode: row.setup_mode || "guided",
    primaryIntents: row.primary_intents || [],
    northStarMetrics: row.north_star_metrics || [],
    assistantStyle: row.assistant_style || "executive",
    frictionProfile: row.friction_profile || {},
    voiceProfile: row.voice_profile || {},
    sensoryPrefs: row.sensory_prefs || {},
    dailyRhythm: row.daily_rhythm || {},
    calendarConnected: row.calendar_connected || false,
    integrations: row.integrations || [],
    wealthProfile: row.wealth_profile,
    healthProfile: row.health_profile,
    focusProfile: row.focus_profile,
    sovereigntyProfile: row.sovereignty_profile || {},
    autonomyLevel: row.autonomy_level || "suggest",
    guardrails: row.guardrails || {},
    automations: row.automations || [],
    avatarStyle: row.avatar_style || "orb",
    presenceStyle: row.presence_style || "calm",
    signaturePhrase: row.signature_phrase,
    morningRitual: row.morning_ritual ?? true,
    theme: row.theme || "dark",
    onboardingVersion: row.onboarding_version || 1,
    completedAt: row.completed_at,
  };
}

export async function saveUserPreferences(userId: string, data: OnboardingData): Promise<boolean> {
  try {
    const dbData = toDbFormat(data);
    
    // Check if user preferences exist
    const { data: existing } = await supabase
      .from("user_preferences")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from("user_preferences")
        .update({ ...dbData, updated_at: new Date().toISOString() })
        .eq("user_id", userId);

      if (error) {
        console.error("Error updating user preferences:", error);
        return false;
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from("user_preferences")
        .insert({ ...dbData, user_id: userId });

      if (error) {
        console.error("Error inserting user preferences:", error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error saving user preferences:", error);
    return false;
  }
}

export async function loadUserPreferences(userId: string): Promise<Partial<OnboardingData> | null> {
  try {
    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return null;
    }

    return fromDbFormat(data);
  } catch (error) {
    console.error("Error loading user preferences:", error);
    return null;
  }
}

export async function getUserProfile(userId: string): Promise<{ name: string } | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("name")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return null;
    }

    return { name: data.name || "" };
  } catch (error) {
    console.error("Error loading user profile:", error);
    return null;
  }
}

export async function saveUserProfile(userId: string, name: string): Promise<boolean> {
  try {
    // Check if profile exists
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("profiles")
        .update({ name, updated_at: new Date().toISOString() })
        .eq("user_id", userId);

      if (error) {
        console.error("Error updating profile:", error);
        return false;
      }
    } else {
      const { error } = await supabase
        .from("profiles")
        .insert({ user_id: userId, name });

      if (error) {
        console.error("Error inserting profile:", error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error saving user profile:", error);
    return false;
  }
}
