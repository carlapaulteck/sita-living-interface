import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { 
  Flag, 
  Plus, 
  Pencil, 
  Trash2, 
  Users, 
  Shield, 
  Percent,
  Search,
  ToggleLeft,
  ToggleRight,
  RefreshCw
} from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type FeatureFlag = Tables<'feature_flags'>;

const ROLES = ['admin', 'moderator', 'user'] as const;

const AdminFeatureFlagsPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const [deletingFlag, setDeletingFlag] = useState<FeatureFlag | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    key: '',
    name: '',
    description: '',
    is_enabled: false,
    enabled_for_roles: [] as string[],
    percentage_rollout: 100,
  });

  // Fetch feature flags
  const { data: flags, isLoading } = useQuery({
    queryKey: ['feature-flags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FeatureFlag[];
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('feature_flags')
        .insert({
          key: data.key.toLowerCase().replace(/\s+/g, '_'),
          name: data.name,
          description: data.description || null,
          is_enabled: data.is_enabled,
          enabled_for_roles: data.enabled_for_roles,
          percentage_rollout: data.percentage_rollout,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      setIsCreateOpen(false);
      resetForm();
      toast.success('Feature flag created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create feature flag');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<FeatureFlag> & { id: string }) => {
      const { error } = await supabase
        .from('feature_flags')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      setEditingFlag(null);
      resetForm();
      toast.success('Feature flag updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update feature flag');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('feature_flags')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      setDeletingFlag(null);
      toast.success('Feature flag deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete feature flag');
    },
  });

  // Toggle enabled mutation
  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_enabled }: { id: string; is_enabled: boolean }) => {
      const { error } = await supabase
        .from('feature_flags')
        .update({ is_enabled })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to toggle feature flag');
    },
  });

  const resetForm = () => {
    setFormData({
      key: '',
      name: '',
      description: '',
      is_enabled: false,
      enabled_for_roles: [],
      percentage_rollout: 100,
    });
  };

  const openEditDialog = (flag: FeatureFlag) => {
    setEditingFlag(flag);
    setFormData({
      key: flag.key,
      name: flag.name,
      description: flag.description || '',
      is_enabled: flag.is_enabled || false,
      enabled_for_roles: flag.enabled_for_roles || [],
      percentage_rollout: flag.percentage_rollout || 100,
    });
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      enabled_for_roles: prev.enabled_for_roles.includes(role)
        ? prev.enabled_for_roles.filter(r => r !== role)
        : [...prev.enabled_for_roles, role],
    }));
  };

  const handleSubmit = () => {
    if (!formData.key || !formData.name) {
      toast.error('Key and name are required');
      return;
    }

    if (editingFlag) {
      updateMutation.mutate({
        id: editingFlag.id,
        name: formData.name,
        description: formData.description || null,
        is_enabled: formData.is_enabled,
        enabled_for_roles: formData.enabled_for_roles,
        percentage_rollout: formData.percentage_rollout,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredFlags = flags?.filter(flag => 
    flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flag.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const FormContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="key">Key</Label>
          <Input
            id="key"
            placeholder="feature_key"
            value={formData.key}
            onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
            disabled={!!editingFlag}
            className="bg-white/5 border-white/10"
          />
          <p className="text-xs text-muted-foreground">Unique identifier (auto-formatted)</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Feature Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="bg-white/5 border-white/10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe what this feature does..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="bg-white/5 border-white/10 min-h-[80px]"
        />
      </div>

      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
        <div>
          <Label className="text-base">Enabled</Label>
          <p className="text-sm text-muted-foreground">Toggle this feature on/off globally</p>
        </div>
        <Switch
          checked={formData.is_enabled}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_enabled: checked }))}
        />
      </div>

      <div className="space-y-3">
        <Label>Target Roles</Label>
        <div className="flex gap-3">
          {ROLES.map((role) => (
            <label
              key={role}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <Checkbox
                checked={formData.enabled_for_roles.includes(role)}
                onCheckedChange={() => handleRoleToggle(role)}
              />
              <span className="capitalize">{role}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Rollout Percentage</Label>
          <span className="text-sm text-primary font-medium">{formData.percentage_rollout}%</span>
        </div>
        <Slider
          value={[formData.percentage_rollout]}
          onValueChange={([value]) => setFormData(prev => ({ ...prev, percentage_rollout: value }))}
          max={100}
          step={5}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Gradually roll out to a percentage of eligible users
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Flag className="w-6 h-6 text-primary" />
            Feature Flags
          </h1>
          <p className="text-muted-foreground mt-1">
            Control feature access for roles and users without code deployment
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsCreateOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              New Flag
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#111111] border-white/10 max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Feature Flag</DialogTitle>
              <DialogDescription>
                Add a new feature flag to control feature access
              </DialogDescription>
            </DialogHeader>
            <FormContent />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Flag'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search flags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/5 border-white/10"
        />
      </div>

      {/* Flags Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-[#111111] border-white/10">
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredFlags?.length === 0 ? (
        <Card className="bg-[#111111] border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Flag className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No feature flags found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? 'Try a different search term' : 'Create your first feature flag to get started'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Flag
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredFlags?.map((flag) => (
            <Card key={flag.id} className="bg-[#111111] border-white/10 hover:border-white/20 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {flag.is_enabled ? (
                        <ToggleRight className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                      )}
                      {flag.name}
                    </CardTitle>
                    <CardDescription className="font-mono text-xs">
                      {flag.key}
                    </CardDescription>
                  </div>
                  <Switch
                    checked={flag.is_enabled || false}
                    onCheckedChange={(checked) => toggleMutation.mutate({ id: flag.id, is_enabled: checked })}
                    disabled={toggleMutation.isPending}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {flag.description && (
                  <p className="text-sm text-muted-foreground">{flag.description}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  {flag.enabled_for_roles?.map((role) => (
                    <Badge key={role} variant="secondary" className="capitalize">
                      <Users className="w-3 h-3 mr-1" />
                      {role}
                    </Badge>
                  ))}
                  {flag.percentage_rollout !== 100 && (
                    <Badge variant="outline" className="text-primary border-primary/30">
                      <Percent className="w-3 h-3 mr-1" />
                      {flag.percentage_rollout}% rollout
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(flag)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeletingFlag(flag)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingFlag} onOpenChange={(open) => !open && setEditingFlag(null)}>
        <DialogContent className="bg-[#111111] border-white/10 max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Feature Flag</DialogTitle>
            <DialogDescription>
              Update feature flag settings
            </DialogDescription>
          </DialogHeader>
          <FormContent />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFlag(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingFlag} onOpenChange={(open) => !open && setDeletingFlag(null)}>
        <AlertDialogContent className="bg-[#111111] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feature Flag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingFlag?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletingFlag && deleteMutation.mutate(deletingFlag.id)}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminFeatureFlagsPage;
