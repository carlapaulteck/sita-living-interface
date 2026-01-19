import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  settings: Json | null;
  subscription_tier: string | null;
  logo_url: string | null;
  max_members: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  permissions: Json | null;
  invited_by: string | null;
  joined_at: string | null;
  created_at: string | null;
}

export const organizationService = {
  /**
   * Get the current user's organizations
   */
  async getMyOrganizations(): Promise<Organization[]> {
    const { data: memberships, error: memberError } = await supabase
      .from("organization_members")
      .select("organization_id");

    if (memberError) throw memberError;

    const orgIds = memberships?.map((m) => m.organization_id) || [];
    if (orgIds.length === 0) return [];

    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .in("id", orgIds)
      .eq("is_active", true);

    if (error) throw error;
    return (data || []) as Organization[];
  },

  /**
   * Get organization by ID
   */
  async getOrganization(orgId: string): Promise<Organization | null> {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", orgId)
      .single();

    if (error) throw error;
    return data as Organization | null;
  },

  /**
   * Get organization by slug
   */
  async getOrganizationBySlug(slug: string): Promise<Organization | null> {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data as Organization | null;
  },

  /**
   * Create a new organization
   */
  async createOrganization(name: string, slug: string): Promise<Organization> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("organizations")
      .insert({
        name,
        slug,
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Add owner as member
    await supabase.from("organization_members").insert({
      organization_id: data.id,
      user_id: user.id,
      role: "owner",
    });

    return data as Organization;
  },

  /**
   * Update organization
   */
  async updateOrganization(
    orgId: string,
    updates: Partial<Pick<Organization, "name" | "settings" | "logo_url">>
  ): Promise<Organization> {
    const { data, error } = await supabase
      .from("organizations")
      .update({
        ...updates,
        settings: updates.settings as unknown as Json,
      })
      .eq("id", orgId)
      .select()
      .single();

    if (error) throw error;
    return data as Organization;
  },

  /**
   * Get organization members
   */
  async getMembers(orgId: string): Promise<OrganizationMember[]> {
    const { data, error } = await supabase
      .from("organization_members")
      .select("*")
      .eq("organization_id", orgId);

    if (error) throw error;
    return (data || []) as OrganizationMember[];
  },

  /**
   * Invite a member to organization
   */
  async inviteMember(
    orgId: string,
    email: string,
    role: string = "member"
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // This is a placeholder - real implementation would use edge function
    // to look up user by email and send invite
    console.log(`Invite sent to ${email} for org ${orgId} with role ${role}`);
  },

  /**
   * Update member role
   */
  async updateMemberRole(
    orgId: string,
    memberId: string,
    role: string
  ): Promise<void> {
    const { error } = await supabase
      .from("organization_members")
      .update({ role })
      .eq("id", memberId)
      .eq("organization_id", orgId);

    if (error) throw error;
  },

  /**
   * Remove a member from organization
   */
  async removeMember(orgId: string, memberId: string): Promise<void> {
    const { error } = await supabase
      .from("organization_members")
      .delete()
      .eq("id", memberId)
      .eq("organization_id", orgId);

    if (error) throw error;
  },

  /**
   * Check if current user is org admin
   */
  async isOrgAdmin(orgId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", orgId)
      .eq("user_id", user.id)
      .single();

    if (error) return false;
    return data?.role === "admin" || data?.role === "owner";
  },

  /**
   * Check if current user is org owner
   */
  async isOrgOwner(orgId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("organizations")
      .select("owner_id")
      .eq("id", orgId)
      .single();

    if (error) return false;
    return data?.owner_id === user.id;
  },
};
