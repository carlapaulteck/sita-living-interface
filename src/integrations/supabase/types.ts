export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_feed: {
        Row: {
          created_at: string | null
          description: string | null
          event_type: string
          icon: string | null
          id: string
          metadata: Json | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_type: string
          icon?: string | null
          id?: string
          metadata?: Json | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_type?: string
          icon?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      cognitive_budget_log: {
        Row: {
          activity: string
          created_at: string | null
          domain: string
          energy_cost: number
          id: string
          user_id: string
        }
        Insert: {
          activity: string
          created_at?: string | null
          domain: string
          energy_cost?: number
          id?: string
          user_id: string
        }
        Update: {
          activity?: string
          created_at?: string | null
          domain?: string
          energy_cost?: number
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      cognitive_profiles: {
        Row: {
          adaptation_mode: string | null
          attention_window: number | null
          auto_change_preference: string | null
          change_tolerance: string | null
          created_at: string | null
          density_preference: string | null
          id: string
          initiation_friction: string | null
          language_softness_preference: number | null
          let_me_struggle: boolean | null
          novelty_tolerance: number | null
          pile_up_response: string | null
          predictability_need: string | null
          progress_visualization: string | null
          reminder_feeling: string | null
          reward_sensitivity: string | null
          self_recognition_tags: string[] | null
          sensory_load_tolerance: Json | null
          structure_preference: string | null
          switching_cost: string | null
          task_organization: string | null
          updated_at: string | null
          user_id: string
          visual_processing: number | null
        }
        Insert: {
          adaptation_mode?: string | null
          attention_window?: number | null
          auto_change_preference?: string | null
          change_tolerance?: string | null
          created_at?: string | null
          density_preference?: string | null
          id?: string
          initiation_friction?: string | null
          language_softness_preference?: number | null
          let_me_struggle?: boolean | null
          novelty_tolerance?: number | null
          pile_up_response?: string | null
          predictability_need?: string | null
          progress_visualization?: string | null
          reminder_feeling?: string | null
          reward_sensitivity?: string | null
          self_recognition_tags?: string[] | null
          sensory_load_tolerance?: Json | null
          structure_preference?: string | null
          switching_cost?: string | null
          task_organization?: string | null
          updated_at?: string | null
          user_id: string
          visual_processing?: number | null
        }
        Update: {
          adaptation_mode?: string | null
          attention_window?: number | null
          auto_change_preference?: string | null
          change_tolerance?: string | null
          created_at?: string | null
          density_preference?: string | null
          id?: string
          initiation_friction?: string | null
          language_softness_preference?: number | null
          let_me_struggle?: boolean | null
          novelty_tolerance?: number | null
          pile_up_response?: string | null
          predictability_need?: string | null
          progress_visualization?: string | null
          reminder_feeling?: string | null
          reward_sensitivity?: string | null
          self_recognition_tags?: string[] | null
          sensory_load_tolerance?: Json | null
          structure_preference?: string | null
          switching_cost?: string | null
          task_organization?: string | null
          updated_at?: string | null
          user_id?: string
          visual_processing?: number | null
        }
        Relationships: []
      }
      cognitive_signals: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          signal_type: string
          user_id: string
          value: number
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          signal_type: string
          user_id: string
          value: number
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          signal_type?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      cognitive_states: {
        Row: {
          cognitive_budget: number | null
          confidence: number | null
          created_at: string | null
          focus_level: number | null
          id: string
          metadata: Json | null
          predicted_next_state: string | null
          state: string
          stress_index: number | null
          time_to_onset_minutes: number | null
          user_id: string
        }
        Insert: {
          cognitive_budget?: number | null
          confidence?: number | null
          created_at?: string | null
          focus_level?: number | null
          id?: string
          metadata?: Json | null
          predicted_next_state?: string | null
          state: string
          stress_index?: number | null
          time_to_onset_minutes?: number | null
          user_id: string
        }
        Update: {
          cognitive_budget?: number | null
          confidence?: number | null
          created_at?: string | null
          focus_level?: number | null
          id?: string
          metadata?: Json | null
          predicted_next_state?: string | null
          state?: string
          stress_index?: number | null
          time_to_onset_minutes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      evolution_patterns: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          last_observed: string | null
          pattern_data: Json | null
          pattern_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          last_observed?: string | null
          pattern_data?: Json | null
          pattern_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          last_observed?: string | null
          pattern_data?: Json | null
          pattern_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          dismissed: boolean | null
          id: string
          message: string
          metadata: Json | null
          priority: string | null
          push_sent: boolean | null
          push_sent_at: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          dismissed?: boolean | null
          id?: string
          message: string
          metadata?: Json | null
          priority?: string | null
          push_sent?: boolean | null
          push_sent_at?: string | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          dismissed?: boolean | null
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string | null
          push_sent?: boolean | null
          push_sent_at?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      personalization_profiles: {
        Row: {
          causality_graph: Json | null
          created_at: string | null
          do_not_touch_zones: string[] | null
          emotional_grammar: Json | null
          failure_taxonomy: Json | null
          id: string
          identity_modes: Json | null
          meaning_anchors: Json | null
          motivation_fingerprint: Json | null
          preference_drift_log: Json | null
          recovery_signature: Json | null
          resistance_log: Json | null
          silence_model: Json | null
          threshold_memory: Json | null
          time_perception: Json | null
          trust_velocity: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          causality_graph?: Json | null
          created_at?: string | null
          do_not_touch_zones?: string[] | null
          emotional_grammar?: Json | null
          failure_taxonomy?: Json | null
          id?: string
          identity_modes?: Json | null
          meaning_anchors?: Json | null
          motivation_fingerprint?: Json | null
          preference_drift_log?: Json | null
          recovery_signature?: Json | null
          resistance_log?: Json | null
          silence_model?: Json | null
          threshold_memory?: Json | null
          time_perception?: Json | null
          trust_velocity?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          causality_graph?: Json | null
          created_at?: string | null
          do_not_touch_zones?: string[] | null
          emotional_grammar?: Json | null
          failure_taxonomy?: Json | null
          id?: string
          identity_modes?: Json | null
          meaning_anchors?: Json | null
          motivation_fingerprint?: Json | null
          preference_drift_log?: Json | null
          recovery_signature?: Json | null
          resistance_log?: Json | null
          silence_model?: Json | null
          threshold_memory?: Json | null
          time_perception?: Json | null
          trust_velocity?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string | null
          endpoint: string
          id: string
          p256dh_key: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string | null
          endpoint: string
          id?: string
          p256dh_key: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          p256dh_key?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      realtime_metrics: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          metric_type: string
          previous_value: number | null
          trend: string | null
          updated_at: string | null
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_type: string
          previous_value?: number | null
          trend?: string | null
          updated_at?: string | null
          user_id: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_type?: string
          previous_value?: number | null
          trend?: string | null
          updated_at?: string | null
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          assistant_style: string | null
          automations: Json | null
          autonomy_level: string | null
          avatar_style: string | null
          calendar_connected: boolean | null
          completed_at: string | null
          created_at: string
          daily_rhythm: Json | null
          focus_profile: Json | null
          friction_profile: Json | null
          guardrails: Json | null
          health_profile: Json | null
          id: string
          integrations: Json | null
          morning_ritual: boolean | null
          north_star_metrics: string[] | null
          onboarding_version: number | null
          presence_style: string | null
          primary_intents: string[] | null
          sensory_prefs: Json | null
          setup_mode: string | null
          signature_phrase: string | null
          sovereignty_profile: Json | null
          theme: string | null
          updated_at: string
          user_id: string | null
          voice_profile: Json | null
          wealth_profile: Json | null
        }
        Insert: {
          assistant_style?: string | null
          automations?: Json | null
          autonomy_level?: string | null
          avatar_style?: string | null
          calendar_connected?: boolean | null
          completed_at?: string | null
          created_at?: string
          daily_rhythm?: Json | null
          focus_profile?: Json | null
          friction_profile?: Json | null
          guardrails?: Json | null
          health_profile?: Json | null
          id?: string
          integrations?: Json | null
          morning_ritual?: boolean | null
          north_star_metrics?: string[] | null
          onboarding_version?: number | null
          presence_style?: string | null
          primary_intents?: string[] | null
          sensory_prefs?: Json | null
          setup_mode?: string | null
          signature_phrase?: string | null
          sovereignty_profile?: Json | null
          theme?: string | null
          updated_at?: string
          user_id?: string | null
          voice_profile?: Json | null
          wealth_profile?: Json | null
        }
        Update: {
          assistant_style?: string | null
          automations?: Json | null
          autonomy_level?: string | null
          avatar_style?: string | null
          calendar_connected?: boolean | null
          completed_at?: string | null
          created_at?: string
          daily_rhythm?: Json | null
          focus_profile?: Json | null
          friction_profile?: Json | null
          guardrails?: Json | null
          health_profile?: Json | null
          id?: string
          integrations?: Json | null
          morning_ritual?: boolean | null
          north_star_metrics?: string[] | null
          onboarding_version?: number | null
          presence_style?: string | null
          primary_intents?: string[] | null
          sensory_prefs?: Json | null
          setup_mode?: string | null
          signature_phrase?: string | null
          sovereignty_profile?: Json | null
          theme?: string | null
          updated_at?: string
          user_id?: string | null
          voice_profile?: Json | null
          wealth_profile?: Json | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
