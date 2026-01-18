import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Tables } from '@/integrations/supabase/types';

type FeatureFlag = Tables<'feature_flags'>;

interface UseFeatureFlagResult {
  isEnabled: boolean;
  isLoading: boolean;
  flag: FeatureFlag | null;
}

/**
 * Hook to check if a feature flag is enabled for the current user
 * 
 * Checks in order:
 * 1. Is the flag globally enabled?
 * 2. Is user's role in enabled_for_roles?
 * 3. Is user's ID in enabled_for_users? (override)
 * 4. Is user's ID in disabled_for_users? (exclusion)
 * 5. Percentage rollout (deterministic based on user ID)
 */
export function useFeatureFlag(key: string): UseFeatureFlagResult {
  const { user } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  const { data: flag, isLoading: flagLoading } = useQuery({
    queryKey: ['feature-flag', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .eq('key', key)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Flag not found
          return null;
        }
        throw error;
      }
      return data as FeatureFlag;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const isLoading = flagLoading || roleLoading;

  if (isLoading || !flag) {
    return {
      isEnabled: false,
      isLoading,
      flag: null,
    };
  }

  // Check if user is explicitly disabled
  if (user && flag.disabled_for_users?.includes(user.id)) {
    return {
      isEnabled: false,
      isLoading: false,
      flag,
    };
  }

  // Check if user is explicitly enabled
  if (user && flag.enabled_for_users?.includes(user.id)) {
    return {
      isEnabled: true,
      isLoading: false,
      flag,
    };
  }

  // Check if flag is globally disabled
  if (!flag.is_enabled) {
    return {
      isEnabled: false,
      isLoading: false,
      flag,
    };
  }

  // Check role-based access
  if (flag.enabled_for_roles && flag.enabled_for_roles.length > 0) {
    if (!role || !flag.enabled_for_roles.includes(role)) {
      return {
        isEnabled: false,
        isLoading: false,
        flag,
      };
    }
  }

  // Check percentage rollout
  if (flag.percentage_rollout !== null && flag.percentage_rollout < 100 && user) {
    const hash = hashUserId(user.id);
    const threshold = flag.percentage_rollout / 100;
    
    if (hash > threshold) {
      return {
        isEnabled: false,
        isLoading: false,
        flag,
      };
    }
  }

  return {
    isEnabled: true,
    isLoading: false,
    flag,
  };
}

/**
 * Hook to fetch all feature flags at once (for admin or caching)
 */
export function useAllFeatureFlags() {
  return useQuery({
    queryKey: ['feature-flags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FeatureFlag[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Deterministic hash function for percentage rollout
 * Returns a value between 0 and 1 based on user ID
 */
function hashUserId(userId: string): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Normalize to 0-1 range
  return Math.abs(hash) / 2147483647;
}
