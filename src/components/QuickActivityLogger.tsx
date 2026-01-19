import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Loader2, Dumbbell, BookOpen, Briefcase, Coffee, Moon, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface QuickActivityLoggerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const activityTypes = [
  { id: 'workout', label: 'Workout', icon: Dumbbell, color: 'bg-green-500' },
  { id: 'learning', label: 'Learning', icon: BookOpen, color: 'bg-blue-500' },
  { id: 'work', label: 'Work', icon: Briefcase, color: 'bg-purple-500' },
  { id: 'break', label: 'Break', icon: Coffee, color: 'bg-orange-500' },
  { id: 'sleep', label: 'Sleep', icon: Moon, color: 'bg-indigo-500' },
  { id: 'wellness', label: 'Wellness', icon: Heart, color: 'bg-pink-500' },
];

export const QuickActivityLogger: React.FC<QuickActivityLoggerProps> = ({ 
  isOpen, 
  onClose,
  onSuccess 
}) => {
  const { user } = useAuth();
  const [activityType, setActivityType] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedActivity = activityTypes.find(a => a.id === activityType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activityType) {
      toast.error('Please select an activity type');
      return;
    }

    if (!user) {
      toast.error('Please sign in to log activities');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('activity_feed').insert({
        user_id: user.id,
        event_type: 'activity_logged',
        title: title || `${selectedActivity?.label} activity`,
        description: notes || undefined,
        icon: activityType,
        metadata: {
          activity_type: activityType,
          duration_minutes: duration ? parseInt(duration) : undefined,
        },
      });

      if (error) throw error;

      toast.success('Activity logged!', {
        description: `${selectedActivity?.label}: ${title || 'Activity recorded'}`,
      });

      // Reset form
      setActivityType('');
      setTitle('');
      setNotes('');
      setDuration('');
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error logging activity:', error);
      toast.error('Failed to log activity');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-md z-[101]"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <form 
              onSubmit={handleSubmit}
              className="glass-card border border-border/50 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold">Log Activity</h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Activity Type Grid */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">What did you do?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {activityTypes.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <button
                          key={activity.id}
                          type="button"
                          onClick={() => setActivityType(activity.id)}
                          className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg transition-all ${
                            activityType === activity.id 
                              ? `${activity.color} text-white shadow-lg scale-105` 
                              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-xs font-medium">{activity.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Title */}
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What specifically? (optional)"
                />
                
                {/* Duration */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="30"
                    min="1"
                  />
                </div>
                
                {/* Notes */}
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any notes? (optional)"
                  rows={2}
                  className="resize-none"
                />
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border/50 bg-muted/20">
                <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isSubmitting || !activityType}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging...
                    </>
                  ) : (
                    'Log Activity'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
