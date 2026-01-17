import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const users = [
      { email: "admin@sita.ai", password: "admin123!", name: "SITA Admin", role: "admin" },
      { email: "client@sita.ai", password: "client123!", name: "Test Client", role: "user" },
    ];

    const results: Array<{
      email: string;
      status?: string;
      userId?: string;
      role?: string;
      roleStatus?: string;
      error?: string;
    }> = [];

    for (const userData of users) {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === userData.email);

      let userId: string;

      if (existingUser) {
        userId = existingUser.id;
        results.push({ email: userData.email, status: "already exists", userId });
      } else {
        // Create user
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
          user_metadata: { name: userData.name },
        });

        if (createError) {
          results.push({ email: userData.email, status: "error", error: createError.message });
          continue;
        }

        userId = newUser.user.id;

        // Create profile
        await supabaseAdmin.from("profiles").upsert({
          user_id: userId,
          name: userData.name,
        });

        results.push({ email: userData.email, status: "created", userId });
      }

      // Assign role (using service role to bypass RLS)
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .upsert(
          { user_id: userId, role: userData.role },
          { onConflict: "user_id,role" }
        );

      if (roleError) {
        results[results.length - 1].roleStatus = "error";
        results[results.length - 1].error = roleError.message;
      } else {
        results[results.length - 1].role = userData.role;
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
