import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Calendar, Tag, Flag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface QuickTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-blue-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
];

const categories = [
  'Work', 'Personal', 'Health', 'Finance', 'Family', 'Learning'
];

export const QuickTaskModal: React.FC<QuickTaskModalProps> = ({ 
  isOpen, 
  onClose,
  onSuccess 
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    if (!user) {
      toast.error('Please sign in to create tasks');
      return;
    }

    setIsSubmitting(true);

    try {
      // Log activity for the task creation
      const { error } = await supabase.from('activity_feed').insert({
        user_id: user.id,
        event_type: 'task_created',
        title: `Created task: ${title}`,
        description: description || undefined,
        icon: 'sparkles',
        metadata: {
          priority,
          category,
          due_date: dueDate || undefined,
        },
      });

      if (error) throw error;

      toast.success('Task created successfully!', {
        description: title,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('');
      setDueDate('');
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e as unknown as React.FormEvent);
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
            onKeyDown={handleKeyDown}
          >
            <form 
              onSubmit={handleSubmit}
              className="glass-card border border-border/50 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold">Quick Task</h2>
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
                {/* Title */}
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="text-base"
                  autoFocus
                />
                
                {/* Description */}
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add details (optional)"
                  rows={2}
                  className="resize-none"
                />
                
                {/* Priority */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Flag className="w-3.5 h-3.5" />
                    Priority
                  </label>
                  <div className="flex gap-2">
                    {priorities.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPriority(p.value)}
                        className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                          priority === p.value 
                            ? `${p.color} text-white shadow-lg scale-105` 
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Category & Due Date Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-muted/50 border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select...</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Due Date
                    </label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-muted/20">
                <span className="text-xs text-muted-foreground">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">⌘</kbd>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono ml-1">↵</kbd>
                  to save
                </span>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Task'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
