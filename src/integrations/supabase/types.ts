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
      admin_announcements: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          starts_at: string | null
          target_roles: string[] | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          starts_at?: string | null
          target_roles?: string[] | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          starts_at?: string | null
          target_roles?: string[] | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      agent_activities: {
        Row: {
          action: string
          agent_name: string
          created_at: string
          id: string
          metadata: Json | null
          priority: string | null
          status: string
          user_id: string
        }
        Insert: {
          action: string
          agent_name: string
          created_at?: string
          id?: string
          metadata?: Json | null
          priority?: string | null
          status?: string
          user_id: string
        }
        Update: {
          action?: string
          agent_name?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          priority?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          target_id: string | null
          target_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      automation_runs: {
        Row: {
          actions_taken: Json | null
          automation_id: string
          automation_name: string
          created_at: string | null
          id: string
          metadata: Json | null
          status: string | null
          trigger_event: string
          user_id: string
        }
        Insert: {
          actions_taken?: Json | null
          automation_id: string
          automation_name: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          trigger_event: string
          user_id: string
        }
        Update: {
          actions_taken?: Json | null
          automation_id?: string
          automation_name?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          trigger_event?: string
          user_id?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          attendees: Json | null
          calendar_source: string | null
          color: string | null
          created_at: string
          description: string | null
          end_time: string
          external_id: string | null
          id: string
          is_all_day: boolean | null
          is_focus_block: boolean | null
          is_meeting: boolean | null
          location: string | null
          metadata: Json | null
          recurrence_rule: string | null
          start_time: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attendees?: Json | null
          calendar_source?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          end_time: string
          external_id?: string | null
          id?: string
          is_all_day?: boolean | null
          is_focus_block?: boolean | null
          is_meeting?: boolean | null
          location?: string | null
          metadata?: Json | null
          recurrence_rule?: string | null
          start_time: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attendees?: Json | null
          calendar_source?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          end_time?: string
          external_id?: string | null
          id?: string
          is_all_day?: boolean | null
          is_focus_block?: boolean | null
          is_meeting?: boolean | null
          location?: string | null
          metadata?: Json | null
          recurrence_rule?: string | null
          start_time?: string
          title?: string
          updated_at?: string
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
      conversation_contexts: {
        Row: {
          confidence: number | null
          content: string
          context_type: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          source_conversation_id: string | null
          user_id: string
        }
        Insert: {
          confidence?: number | null
          content: string
          context_type: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          source_conversation_id?: string | null
          user_id: string
        }
        Update: {
          confidence?: number | null
          content?: string
          context_type?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          source_conversation_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_contexts_source_conversation_id_fkey"
            columns: ["source_conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_messages: {
        Row: {
          cognitive_state: string | null
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          latency_ms: number | null
          metadata: Json | null
          model_used: string | null
          role: string
          sentiment: string | null
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          cognitive_state?: string | null
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
          model_used?: string | null
          role: string
          sentiment?: string | null
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          cognitive_state?: string | null
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
          model_used?: string | null
          role?: string
          sentiment?: string | null
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          archived_at: string | null
          created_at: string | null
          id: string
          message_count: number | null
          metadata: Json | null
          personality_mode: string | null
          summary: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string | null
          id?: string
          message_count?: number | null
          metadata?: Json | null
          personality_mode?: string | null
          summary?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string | null
          id?: string
          message_count?: number | null
          metadata?: Json | null
          personality_mode?: string | null
          summary?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          component: string | null
          created_at: string | null
          error_type: string
          id: string
          is_resolved: boolean | null
          message: string
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          stack_trace: string | null
          user_id: string | null
        }
        Insert: {
          component?: string | null
          created_at?: string | null
          error_type: string
          id?: string
          is_resolved?: boolean | null
          message: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          stack_trace?: string | null
          user_id?: string | null
        }
        Update: {
          component?: string | null
          created_at?: string | null
          error_type?: string
          id?: string
          is_resolved?: boolean | null
          message?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          stack_trace?: string | null
          user_id?: string | null
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
      feature_flags: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          disabled_for_users: string[] | null
          enabled_for_roles: string[] | null
          enabled_for_users: string[] | null
          id: string
          is_enabled: boolean | null
          key: string
          metadata: Json | null
          name: string
          percentage_rollout: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          disabled_for_users?: string[] | null
          enabled_for_roles?: string[] | null
          enabled_for_users?: string[] | null
          id?: string
          is_enabled?: boolean | null
          key: string
          metadata?: Json | null
          name: string
          percentage_rollout?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          disabled_for_users?: string[] | null
          enabled_for_roles?: string[] | null
          enabled_for_users?: string[] | null
          id?: string
          is_enabled?: boolean | null
          key?: string
          metadata?: Json | null
          name?: string
          percentage_rollout?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      finance_budgets: {
        Row: {
          budget_amount: number
          category: string
          color: string | null
          created_at: string
          id: string
          period: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_amount: number
          category: string
          color?: string | null
          created_at?: string
          id?: string
          period?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_amount?: number
          category?: string
          color?: string | null
          created_at?: string
          id?: string
          period?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      finance_investments: {
        Row: {
          allocation_percentage: number | null
          cost_basis: number
          created_at: string
          current_value: number
          id: string
          investment_type: string
          name: string
          shares: number | null
          symbol: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allocation_percentage?: number | null
          cost_basis: number
          created_at?: string
          current_value: number
          id?: string
          investment_type: string
          name: string
          shares?: number | null
          symbol?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allocation_percentage?: number | null
          cost_basis?: number
          created_at?: string
          current_value?: number
          id?: string
          investment_type?: string
          name?: string
          shares?: number | null
          symbol?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      finance_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string | null
          id: string
          is_recurring: boolean | null
          name: string
          transaction_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          name: string
          transaction_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          name?: string
          transaction_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_completions: {
        Row: {
          completed_at: string
          count: number | null
          created_at: string
          habit_id: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          count?: number | null
          created_at?: string
          habit_id: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          count?: number | null
          created_at?: string
          habit_id?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          domain: string | null
          frequency: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          reminder_time: string | null
          target_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          domain?: string | null
          frequency?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          reminder_time?: string | null
          target_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          domain?: string | null
          frequency?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          reminder_time?: string | null
          target_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_batches: {
        Row: {
          batch_type: string
          cognitive_state: string | null
          created_at: string
          delivered_at: string | null
          id: string
          notification_ids: string[] | null
          priority: string | null
          scheduled_for: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          batch_type?: string
          cognitive_state?: string | null
          created_at?: string
          delivered_at?: string | null
          id?: string
          notification_ids?: string[] | null
          priority?: string | null
          scheduled_for?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          batch_type?: string
          cognitive_state?: string | null
          created_at?: string
          delivered_at?: string | null
          id?: string
          notification_ids?: string[] | null
          priority?: string | null
          scheduled_for?: string | null
          status?: string | null
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
      savings_goals: {
        Row: {
          category: string
          color: string | null
          completed_at: string | null
          created_at: string
          current_amount: number
          deadline: string | null
          icon: string | null
          id: string
          is_completed: boolean
          name: string
          target_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          color?: string | null
          completed_at?: string | null
          created_at?: string
          current_amount?: number
          deadline?: string | null
          icon?: string | null
          id?: string
          is_completed?: boolean
          name: string
          target_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          color?: string | null
          completed_at?: string | null
          created_at?: string
          current_amount?: number
          deadline?: string | null
          icon?: string | null
          id?: string
          is_completed?: boolean
          name?: string
          target_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      support_ticket_messages: {
        Row: {
          created_at: string | null
          id: string
          is_admin_reply: boolean | null
          message: string
          sender_id: string
          ticket_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_admin_reply?: boolean | null
          message: string
          sender_id: string
          ticket_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_admin_reply?: boolean | null
          message?: string
          sender_id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string | null
          id: string
          message: string
          priority: string
          status: string
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          message: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          message?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_agents: {
        Row: {
          agent_name: string
          config: Json | null
          created_at: string
          id: string
          last_action: string | null
          last_action_at: string | null
          status: string
          tasks_completed: number
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_name: string
          config?: Json | null
          created_at?: string
          id?: string
          last_action?: string | null
          last_action_at?: string | null
          status?: string
          tasks_completed?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_name?: string
          config?: Json | null
          created_at?: string
          id?: string
          last_action?: string | null
          last_action_at?: string | null
          status?: string
          tasks_completed?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_automations: {
        Row: {
          action_config: Json | null
          action_type: string
          cooldown_minutes: number | null
          created_at: string | null
          description: string | null
          id: string
          is_enabled: boolean | null
          name: string
          priority: number | null
          trigger_config: Json | null
          trigger_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_config?: Json | null
          action_type: string
          cooldown_minutes?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          name: string
          priority?: number | null
          trigger_config?: Json | null
          trigger_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_config?: Json | null
          action_type?: string
          cooldown_minutes?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          name?: string
          priority?: number | null
          trigger_config?: Json | null
          trigger_type?: string
          updated_at?: string | null
          user_id?: string
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
