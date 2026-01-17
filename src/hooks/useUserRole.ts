import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = "admin" | "moderator" | "user";

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      setLoading(true);
      
      // Call the security definer function
      const { data, error } = await supabase
        .rpc('get_user_role', { _user_id: user.id });

      if (error) {
        console.error("Error fetching role:", error);
        setRole("user"); // Default to user role
      } else {
        setRole(data as AppRole || "user");
      }
      
      setLoading(false);
    };

    fetchRole();
  }, [user]);

  return {
    role,
    loading,
    isAdmin: role === "admin",
    isModerator: role === "moderator" || role === "admin",
    isUser: !!role,
  };
}
