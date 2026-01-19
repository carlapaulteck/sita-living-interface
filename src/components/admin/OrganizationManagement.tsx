import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Plus, 
  Users, 
  Settings,
  Crown,
  Shield,
  UserPlus,
  Mail,
  MoreVertical,
  ExternalLink
} from "lucide-react";
import { organizationService, type Organization, type OrganizationMember } from "@/services/organization.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function OrganizationManagement() {
  const queryClient = useQueryClient();
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgSlug, setNewOrgSlug] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member" | "viewer">("member");

  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => organizationService.getMyOrganizations(),
  });

  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ["org-members", selectedOrg?.id],
    queryFn: () => selectedOrg ? organizationService.getMembers(selectedOrg.id) : Promise.resolve([]),
    enabled: !!selectedOrg,
  });

  const createMutation = useMutation({
    mutationFn: () => organizationService.createOrganization(newOrgName, newOrgSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organization created successfully");
      setIsCreateOpen(false);
      setNewOrgName("");
      setNewOrgSlug("");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create organization: ${error.message}`);
    },
  });

  const inviteMutation = useMutation({
    mutationFn: () => {
      if (!selectedOrg) throw new Error("No organization selected");
      return organizationService.inviteMember(selectedOrg.id, inviteEmail, inviteRole);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-members", selectedOrg?.id] });
      toast.success("Invitation sent successfully");
      setIsInviteOpen(false);
      setInviteEmail("");
    },
    onError: (error: Error) => {
      toast.error(`Failed to send invitation: ${error.message}`);
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => {
      if (!selectedOrg) throw new Error("No organization selected");
      return organizationService.removeMember(selectedOrg.id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-members", selectedOrg?.id] });
      toast.success("Member removed");
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "admin" | "member" | "viewer" }) => {
      if (!selectedOrg) throw new Error("No organization selected");
      return organizationService.updateMemberRole(selectedOrg.id, userId, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-members", selectedOrg?.id] });
      toast.success("Role updated");
    },
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner": return <Crown className="h-4 w-4 text-amber-500" />;
      case "admin": return <Shield className="h-4 w-4 text-primary" />;
      default: return <Users className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner": return <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">Owner</Badge>;
      case "admin": return <Badge className="bg-primary/20 text-primary border-primary/30">Admin</Badge>;
      case "member": return <Badge variant="secondary">Member</Badge>;
      default: return <Badge variant="outline">Viewer</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Organizations</h2>
          <p className="text-sm text-muted-foreground">
            Manage teams and access control
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Organization</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="org-name">Organization Name</Label>
                <Input
                  id="org-name"
                  placeholder="Acme Inc."
                  value={newOrgName}
                  onChange={(e) => {
                    setNewOrgName(e.target.value);
                    setNewOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="org-slug">URL Slug</Label>
                <Input
                  id="org-slug"
                  placeholder="acme-inc"
                  value={newOrgSlug}
                  onChange={(e) => setNewOrgSlug(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be used in URLs: /org/{newOrgSlug || "slug"}
                </p>
              </div>
              <Button
                onClick={() => createMutation.mutate()}
                disabled={!newOrgName || !newOrgSlug || createMutation.isPending}
                className="w-full"
              >
                Create Organization
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Organization List */}
        <div className="lg:col-span-1 space-y-3">
          <AnimatePresence mode="popLayout">
            {organizations.length === 0 ? (
              <GlassCard className="p-6 text-center">
                <Building2 className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-foreground font-medium">No organizations</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create one to get started
                </p>
              </GlassCard>
            ) : (
              organizations.map((org, index) => (
                <motion.div
                  key={org.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard
                    className={`p-4 cursor-pointer transition-all hover:border-primary/30 ${
                      selectedOrg?.id === org.id ? "border-primary/50 bg-primary/5" : ""
                    }`}
                    onClick={() => setSelectedOrg(org)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={org.logo_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {org.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{org.name}</p>
                        <p className="text-xs text-muted-foreground">/{org.slug}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {org.subscription_tier || "free"}
                      </Badge>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Organization Details */}
        <div className="lg:col-span-2">
          {selectedOrg ? (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedOrg.logo_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {selectedOrg.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedOrg.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created {formatDistanceToNow(new Date(selectedOrg.created_at || ""), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Invite
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="invite-email">Email Address</Label>
                        <Input
                          id="invite-email"
                          type="email"
                          placeholder="colleague@company.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Select value={inviteRole} onValueChange={(v: "admin" | "member" | "viewer") => setInviteRole(v)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => inviteMutation.mutate()}
                        disabled={!inviteEmail || inviteMutation.isPending}
                        className="w-full"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Invitation
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Tabs defaultValue="members">
                <TabsList className="w-full">
                  <TabsTrigger value="members" className="flex-1">Members</TabsTrigger>
                  <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="members" className="mt-4">
                  {membersLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-14 w-full" />
                      <Skeleton className="h-14 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-muted/20"
                        >
                          <div className="flex items-center gap-3">
                            {getRoleIcon(member.role)}
                            <div>
                              <p className="font-medium text-foreground text-sm">{member.user_id}</p>
                              <p className="text-xs text-muted-foreground">
                                Joined {formatDistanceToNow(new Date(member.joined_at || member.created_at || ""), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getRoleBadge(member.role)}
                            {member.role !== "owner" && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => updateRoleMutation.mutate({ userId: member.user_id, role: "admin" })}
                                  >
                                    Make Admin
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => updateRoleMutation.mutate({ userId: member.user_id, role: "member" })}
                                  >
                                    Make Member
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => removeMemberMutation.mutate(member.user_id)}
                                    className="text-destructive"
                                  >
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="settings" className="mt-4">
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-muted/20">
                      <p className="text-sm font-medium text-foreground mb-1">Subscription</p>
                      <p className="text-xs text-muted-foreground">
                        Current plan: <span className="font-medium capitalize">{selectedOrg.subscription_tier || "Free"}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Max members: {selectedOrg.max_members || "Unlimited"}
                      </p>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Organization Settings
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </GlassCard>
          ) : (
            <GlassCard className="p-12 text-center">
              <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
              <p className="text-foreground font-medium">Select an organization</p>
              <p className="text-sm text-muted-foreground mt-1">
                Choose an organization from the list to manage members and settings
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
