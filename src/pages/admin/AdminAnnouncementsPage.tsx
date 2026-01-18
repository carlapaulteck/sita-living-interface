import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  Info,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  target_roles: string[];
  is_active: boolean;
  starts_at: string;
  expires_at: string | null;
  created_by: string;
  created_at: string;
}

const AdminAnnouncementsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info',
    is_active: true
  });
  const queryClient = useQueryClient();

  // Fetch announcements
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  // Create/Update announcement
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (data.id) {
        // Update
        const { error } = await supabase
          .from('admin_announcements')
          .update({
            title: data.title,
            content: data.content,
            type: data.type,
            is_active: data.is_active
          })
          .eq('id', data.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('admin_announcements')
          .insert({
            title: data.title,
            content: data.content,
            type: data.type,
            is_active: data.is_active,
            created_by: user.id
          });
        if (error) throw error;
      }

      // Log audit
      await supabase.from('audit_logs').insert({
        admin_user_id: user.id,
        action: data.id ? 'update_announcement' : 'create_announcement',
        target_type: 'announcement',
        target_id: data.id || null,
        details: { title: data.title }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      setIsDialogOpen(false);
      setEditingAnnouncement(null);
      setFormData({ title: '', content: '', type: 'info', is_active: true });
      toast.success(editingAnnouncement ? 'Announcement updated' : 'Announcement created');
    },
    onError: (error) => {
      toast.error('Failed to save: ' + error.message);
    }
  });

  // Delete announcement
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('admin_announcements')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      toast.success('Announcement deleted');
    }
  });

  // Toggle active status
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('admin_announcements')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
    }
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      case 'update': return <Sparkles className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'update': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      is_active: announcement.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingAnnouncement(null);
    setFormData({ title: '', content: '', type: 'info', is_active: true });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground">Broadcast messages to users</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleDialogClose()}>
              <Plus className="w-4 h-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#111111] border-white/10">
            <DialogHeader>
              <DialogTitle>
                {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Announcement title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  placeholder="Announcement content..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="bg-white/5 border-white/10 min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">
                      <span className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-400" /> Info
                      </span>
                    </SelectItem>
                    <SelectItem value="update">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" /> Update
                      </span>
                    </SelectItem>
                    <SelectItem value="warning">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" /> Warning
                      </span>
                    </SelectItem>
                    <SelectItem value="critical">
                      <span className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400" /> Critical
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleDialogClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => saveMutation.mutate({
                    ...formData,
                    id: editingAnnouncement?.id
                  })}
                  disabled={!formData.title || !formData.content || saveMutation.isPending}
                  className="flex-1"
                >
                  {editingAnnouncement ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Announcements List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-[#151515] border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              All Announcements ({announcements?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-white/5 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : announcements && announcements.length > 0 ? (
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      announcement.is_active
                        ? 'bg-white/5 border-white/10'
                        : 'bg-white/2 border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={getTypeColor(announcement.type)}>
                            {getTypeIcon(announcement.type)}
                            <span className="ml-1">{announcement.type}</span>
                          </Badge>
                          {announcement.is_active ? (
                            <Badge className="bg-emerald-500/10 text-emerald-400">
                              <Eye className="w-3 h-3 mr-1" /> Active
                            </Badge>
                          ) : (
                            <Badge className="bg-zinc-500/10 text-zinc-400">
                              <EyeOff className="w-3 h-3 mr-1" /> Hidden
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium text-foreground">{announcement.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {announcement.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created {format(new Date(announcement.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Switch
                          checked={announcement.is_active}
                          onCheckedChange={(checked) => 
                            toggleActiveMutation.mutate({ id: announcement.id, is_active: checked })
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(announcement)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => {
                            if (confirm('Delete this announcement?')) {
                              deleteMutation.mutate(announcement.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Megaphone className="w-12 h-12 mb-3 opacity-50" />
                <p>No announcements yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminAnnouncementsPage;
