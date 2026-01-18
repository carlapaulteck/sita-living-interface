import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Shield,
  User,
  UserCog,
  Mail,
  Calendar,
  Activity,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserData {
  id: string;
  user_id: string;
  name: string | null;
  created_at: string;
  updated_at: string;
  role?: "admin" | "moderator" | "user";
  email?: string;
}

interface UserDetailDrawerProps {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
  onRoleChange: (userId: string, newRole: "admin" | "moderator" | "user") => Promise<void>;
}

function UserDetailDrawer({ user, isOpen, onClose, onRoleChange }: UserDetailDrawerProps) {
  const [selectedRole, setSelectedRole] = useState<"admin" | "moderator" | "user">(user?.role || "user");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role || "user");
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleRoleUpdate = async () => {
    if (selectedRole === user.role) return;
    setIsUpdating(true);
    try {
      await onRoleChange(user.user_id, selectedRole);
      toast.success("Role updated successfully");
    } catch (error) {
      toast.error("Failed to update role");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-background/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-card border-l border-border/50 overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-medium text-foreground">User Details</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-foreground/5 transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
              <User className="h-8 w-8 text-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-foreground">{user.name || "Unnamed User"}</h3>
              <p className="text-sm text-muted-foreground">{user.email || "No email"}</p>
              <Badge
                variant="secondary"
                className={`mt-1 ${
                  user.role === "admin"
                    ? "bg-primary/20 text-primary"
                    : user.role === "moderator"
                    ? "bg-accent/20 text-accent"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {user.role || "user"}
              </Badge>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-xl bg-foreground/5">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Joined</span>
              </div>
              <p className="text-sm text-foreground">
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-foreground/5">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Activity className="h-4 w-4" />
                <span className="text-xs">Last Active</span>
              </div>
              <p className="text-sm text-foreground">
                {new Date(user.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Role Management */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Role Management
            </h4>
            <div className="p-4 rounded-xl bg-foreground/5 space-y-4">
              <Select
                value={selectedRole}
                onValueChange={(value: "admin" | "moderator" | "user") => setSelectedRole(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      User
                    </div>
                  </SelectItem>
                  <SelectItem value="moderator">
                    <div className="flex items-center gap-2">
                      <UserCog className="h-4 w-4" />
                      Moderator
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {selectedRole !== user.role && (
                <Button
                  onClick={handleRoleUpdate}
                  disabled={isUpdating}
                  className="w-full"
                >
                  {isUpdating ? "Updating..." : "Update Role"}
                </Button>
              )}
            </div>

            <div className="p-4 rounded-xl bg-foreground/5 border border-destructive/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Danger Zone</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Deactivating a user will prevent them from accessing the platform.
                  </p>
                  <Button variant="destructive" size="sm" className="mt-3">
                    Deactivate Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function UserManagementTable() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles: UserData[] = (profiles || []).map((profile) => {
        const userRole = roles?.find((r) => r.user_id === profile.user_id);
        return {
          ...profile,
          role: (userRole?.role as "admin" | "moderator" | "user") || "user",
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.user_id.toLowerCase().includes(query)
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleRoleChange = async (userId: string, newRole: "admin" | "moderator" | "user") => {
    // First check if user already has a role entry
    const { data: existingRole } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (existingRole) {
      // Update existing role
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);

      if (error) throw error;
    } else {
      // Insert new role
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: newRole });

      if (error) throw error;
    }

    // Update local state
    setUsers((prev) =>
      prev.map((user) =>
        user.user_id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getRoleBadgeClass = (role?: string) => {
    switch (role) {
      case "admin":
        return "bg-primary/20 text-primary";
      case "moderator":
        return "bg-accent/20 text-accent";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium text-foreground">User Management</h3>
          <Badge variant="secondary" className="ml-2">
            {filteredUsers.length} users
          </Badge>
        </div>
        <Button onClick={fetchUsers} variant="outline" size="sm" disabled={isLoading}>
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  User
                </th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Role
                </th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  Joined
                </th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  Last Active
                </th>
                <th className="text-right p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/30 hover:bg-foreground/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center shrink-0">
                          <User className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">
                            {user.name || "Unnamed User"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email || user.user_id.slice(0, 8) + "..."}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <Badge
                        variant="secondary"
                        className={`${getRoleBadgeClass(user.role)}`}
                      >
                        {user.role || "user"}
                      </Badge>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.updated_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDrawerOpen(true);
                            }}
                          >
                            <User className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <X className="h-4 w-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </GlassCard>

      {/* User Detail Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <UserDetailDrawer
            user={selectedUser}
            isOpen={isDrawerOpen}
            onClose={() => {
              setIsDrawerOpen(false);
              setSelectedUser(null);
            }}
            onRoleChange={handleRoleChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
