import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Play, Pause, Trash2, Target, Percent, Clock, ArrowUpRight, Coins } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SavingRule {
  id: string;
  name: string;
  trigger_type: 'income_percentage' | 'round_up' | 'fixed_schedule' | 'condition';
  trigger_condition: Record<string, unknown>;
  target_goal_id: string | null;
  amount: number;
  is_percentage: boolean;
  is_active: boolean;
  total_saved: number;
  last_triggered_at: string | null;
}

interface SavingsGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
}

const ruleTemplates = [
  {
    id: 'income_10',
    name: 'Save 10% of Income',
    trigger_type: 'income_percentage' as const,
    amount: 10,
    is_percentage: true,
    icon: Percent,
    color: 'from-emerald-500 to-green-600',
    description: 'Automatically save 10% of every deposit'
  },
  {
    id: 'round_up',
    name: 'Round-Up Savings',
    trigger_type: 'round_up' as const,
    amount: 1,
    is_percentage: false,
    icon: Coins,
    color: 'from-purple-500 to-pink-600',
    description: 'Round up transactions and save the difference'
  },
  {
    id: 'weekly_100',
    name: 'Weekly $100 Transfer',
    trigger_type: 'fixed_schedule' as const,
    amount: 100,
    is_percentage: false,
    icon: Clock,
    color: 'from-cyan-500 to-blue-600',
    description: 'Transfer $100 every week automatically'
  },
  {
    id: 'large_deposit',
    name: 'Large Deposit Bonus',
    trigger_type: 'condition' as const,
    amount: 20,
    is_percentage: true,
    icon: ArrowUpRight,
    color: 'from-amber-500 to-orange-600',
    description: 'Save 20% of deposits over $1,000'
  }
];

export function AutomatedSavings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customRule, setCustomRule] = useState<{
    name: string;
    trigger_type: 'income_percentage' | 'round_up' | 'fixed_schedule' | 'condition';
    amount: number;
    is_percentage: boolean;
    target_goal_id: string;
  }>({
    name: '',
    trigger_type: 'income_percentage',
    amount: 10,
    is_percentage: true,
    target_goal_id: ''
  });

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['saving-rules', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('saving_rules')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as SavingRule[];
    },
    enabled: !!user?.id
  });

  const { data: goals = [] } = useQuery({
    queryKey: ['savings-goals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', false);
      if (error) throw error;
      return data as SavingsGoal[];
    },
    enabled: !!user?.id
  });

  const createRule = useMutation({
    mutationFn: async (rule: Partial<SavingRule>) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { error } = await supabase.from('saving_rules').insert({
        user_id: user.id,
        name: rule.name,
        trigger_type: rule.trigger_type,
        amount: rule.amount,
        is_percentage: rule.is_percentage,
        target_goal_id: rule.target_goal_id || null,
        trigger_condition: {}
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saving-rules'] });
      setIsAddOpen(false);
      setSelectedTemplate(null);
      toast.success('Saving rule created!');
    }
  });

  const toggleRule = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('saving_rules')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saving-rules'] })
  });

  const deleteRule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('saving_rules').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saving-rules'] });
      toast.success('Rule deleted');
    }
  });

  const totalAutoSaved = rules.reduce((sum, r) => sum + (r.total_saved || 0), 0);
  const activeRules = rules.filter(r => r.is_active).length;

  const handleTemplateSelect = (templateId: string) => {
    const template = ruleTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setCustomRule({
        name: template.name,
        trigger_type: template.trigger_type,
        amount: template.amount,
        is_percentage: template.is_percentage,
        target_goal_id: ''
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/30">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Automated Savings</h2>
            <p className="text-sm text-muted-foreground">Set it and forget it wealth building</p>
          </div>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Saving Rule</DialogTitle>
            </DialogHeader>
            
            {!selectedTemplate ? (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {ruleTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <motion.button
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTemplateSelect(template.id)}
                      className={`p-4 rounded-xl bg-gradient-to-br ${template.color} bg-opacity-10 border border-white/10 text-left hover:border-white/20 transition-all`}
                    >
                      <Icon className="w-8 h-8 text-white mb-3" />
                      <h3 className="font-medium text-white">{template.name}</h3>
                      <p className="text-sm text-white/70 mt-1">{template.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Rule Name</label>
                  <Input
                    value={customRule.name}
                    onChange={(e) => setCustomRule({ ...customRule, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Amount {customRule.is_percentage ? '(%)' : '($)'}
                    </label>
                    <Input
                      type="number"
                      value={customRule.amount}
                      onChange={(e) => setCustomRule({ ...customRule, amount: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Target Goal</label>
                    <Select
                      value={customRule.target_goal_id}
                      onValueChange={(v) => setCustomRule({ ...customRule, target_goal_id: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        {goals.map(goal => (
                          <SelectItem key={goal.id} value={goal.id}>{goal.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTemplate(null)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => createRule.mutate(customRule)}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600"
                    disabled={createRule.isPending}
                  >
                    Create Rule
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-to-br from-emerald-500/10 to-green-600/10 border-emerald-500/20">
          <p className="text-sm text-muted-foreground">Total Auto-Saved</p>
          <p className="text-2xl font-bold text-emerald-400">
            ${totalAutoSaved.toLocaleString()}
          </p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/20">
          <p className="text-sm text-muted-foreground">Active Rules</p>
          <p className="text-2xl font-bold text-purple-400">{activeRules}</p>
        </Card>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse bg-white/5">
              <div className="h-16" />
            </Card>
          ))
        ) : rules.length === 0 ? (
          <Card className="p-8 text-center bg-white/5 border-dashed border-white/10">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No saving rules yet</p>
            <p className="text-sm text-muted-foreground/70">Create a rule to start automating your savings</p>
          </Card>
        ) : (
          <AnimatePresence>
            {rules.map((rule, index) => {
              const template = ruleTemplates.find(t => t.trigger_type === rule.trigger_type);
              const Icon = template?.icon || Sparkles;
              const color = template?.color || 'from-gray-500 to-gray-600';

              return (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 bg-white/5 border-white/10">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{rule.name}</h3>
                          {rule.is_active ? (
                            <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs bg-gray-500/20 text-gray-400 rounded-full">
                              Paused
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {rule.is_percentage ? `${rule.amount}%` : `$${rule.amount}`} per trigger
                          {rule.total_saved > 0 && ` • $${rule.total_saved.toLocaleString()} saved`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.is_active}
                          onCheckedChange={(checked) => toggleRule.mutate({ id: rule.id, is_active: checked })}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-red-400"
                          onClick={() => deleteRule.mutate(rule.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
