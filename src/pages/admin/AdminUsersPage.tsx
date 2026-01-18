import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Shield,
  UserCheck,
  UserX,
  Download,
  Plus,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface UserWithRole {
  id: string;
  user_id: string;
  name: string | null;
  created_at: string;
  role: string;
  subscription_plan?: string;
  subscription_status?: string;
}

const AdminUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  // Fetch users with roles and subscriptions
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', searchQuery, roleFilter],
    queryFn: async () => {
      // First get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Then get roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Get subscriptions
      const { data: subscriptions, error: subsError } = await supabase
        .from('subscriptions')
        .select('user_id, plan, status');

      if (subsError) console.log('Subscriptions not accessible or empty');

      // Merge data
      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.user_id);
        const subscription = subscriptions?.find(s => s.user_id === profile.user_id);
        return {
          id: profile.id,
          user_id: profile.user_id || profile.id,
          name: profile.name,
          created_at: profile.created_at,
          role: userRole?.role || 'user',
          subscription_plan: subscription?.plan,
          subscription_status: subscription?.status
        };
      });

      // Apply filters
      let filtered = usersWithRoles;
      
      if (searchQuery) {
        filtered = filtered.filter(u => 
          u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.user_id.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (roleFilter !== 'all') {
        filtered = filtered.filter(u => u.role === roleFilter);
      }

      return filtered;
    }
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      // First check if role exists
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingRole) {
        // Update existing
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole as 'admin' | 'moderator' | 'user' })
          .eq('user_id', userId);
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: newRole as 'admin' | 'moderator' | 'user' });
        if (error) throw error;
      }

      // Log to audit
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('audit_logs').insert({
          admin_user_id: user.id,
          action: 'update_role',
          target_type: 'user',
          target_id: userId,
          details: { new_role: newRole }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update role: ' + error.message);
    }
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'moderator': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getPlanBadgeColor = (plan?: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-amber-500/10 text-amber-400';
      case 'business': return 'bg-cyan-500/10 text-cyan-400';
      case 'pro': return 'bg-emerald-500/10 text-emerald-400';
      default: return 'bg-zinc-500/10 text-zinc-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-[#151515] border-white/5">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or user ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/10">
                <Filter className="w-4 h-4 mr-2" />
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
        </CardContent>
      </Card>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-[#151515] border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Users ({users?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-white/5 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">User</TableHead>
                    <TableHead className="text-muted-foreground">Role</TableHead>
                    <TableHead className="text-muted-foreground">Plan</TableHead>
                    <TableHead className="text-muted-foreground">Joined</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i} className="border-white/5">
                        <TableCell colSpan={5}>
                          <div className="h-12 bg-white/5 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : users && users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id} className="border-white/5 hover:bg-white/5">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9">
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{user.name || 'Unnamed User'}</p>
                              <p className="text-xs text-muted-foreground font-mono">{user.user_id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                            {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPlanBadgeColor(user.subscription_plan)}>
                            {user.subscription_plan || 'free'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(user.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel className="text-xs text-muted-foreground">Change Role</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => updateRoleMutation.mutate({ userId: user.user_id, newRole: 'admin' })}
                                disabled={user.role === 'admin'}
                              >
                                <Shield className="w-4 h-4 mr-2 text-red-400" />
                                Make Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateRoleMutation.mutate({ userId: user.user_id, newRole: 'moderator' })}
                                disabled={user.role === 'moderator'}
                              >
                                <UserCheck className="w-4 h-4 mr-2 text-purple-400" />
                                Make Moderator
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateRoleMutation.mutate({ userId: user.user_id, newRole: 'user' })}
                                disabled={user.role === 'user'}
                              >
                                <UserX className="w-4 h-4 mr-2 text-blue-400" />
                                Make User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminUsersPage;
