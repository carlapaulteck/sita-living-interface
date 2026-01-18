import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, TrendingUp, DollarSign, Plus, Settings, X, Check, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useFinance } from '@/hooks/useFinance';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SpendingAlert {
  id: string;
  alert_type: 'budget_limit' | 'unusual_spending' | 'large_transaction';
  category: string | null;
  threshold_percentage: number;
  threshold_amount: number | null;
  is_active: boolean;
  notification_method: string;
  triggered_at: string | null;
}

const alertTypeConfig = {
  budget_limit: { icon: TrendingUp, color: 'from-amber-500 to-orange-600', label: 'Budget Limit' },
  unusual_spending: { icon: AlertTriangle, color: 'from-purple-500 to-pink-600', label: 'Unusual Spending' },
  large_transaction: { icon: DollarSign, color: 'from-cyan-500 to-blue-600', label: 'Large Transaction' }
};

export function SpendingAlerts() {
  const { user } = useAuth();
  const { transactions, budgets } = useFinance();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newAlert, setNewAlert] = useState<{
    alert_type: 'budget_limit' | 'unusual_spending' | 'large_transaction';
    category: string;
    threshold_percentage: number;
    threshold_amount: number;
    notification_method: string;
  }>({
    alert_type: 'budget_limit',
    category: '',
    threshold_percentage: 80,
    threshold_amount: 500,
    notification_method: 'in_app'
  });

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['spending-alerts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('spending_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as SpendingAlert[];
    },
    enabled: !!user?.id
  });

  const createAlert = useMutation({
    mutationFn: async (alert: typeof newAlert) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { error } = await supabase.from('spending_alerts').insert({
        user_id: user.id,
        ...alert,
        category: alert.category || null,
        threshold_amount: alert.alert_type === 'large_transaction' ? alert.threshold_amount : null
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spending-alerts'] });
      setIsAddOpen(false);
      toast.success('Alert created successfully');
    }
  });

  const toggleAlert = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('spending_alerts')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['spending-alerts'] })
  });

  const deleteAlert = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('spending_alerts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spending-alerts'] });
      toast.success('Alert deleted');
    }
  });

  // Calculate triggered alerts based on current spending
  const triggeredAlerts = alerts.filter(alert => {
    if (!alert.is_active) return false;
    
    if (alert.alert_type === 'budget_limit' && alert.category) {
      const budget = budgets.find(b => b.category === alert.category);
      const spent = transactions
        .filter(t => t.category === alert.category && t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      if (budget) {
        const percentage = (spent / budget.budget_amount) * 100;
        return percentage >= alert.threshold_percentage;
      }
    }
    
    if (alert.alert_type === 'large_transaction' && alert.threshold_amount) {
      return transactions.some(t => Math.abs(t.amount) >= alert.threshold_amount!);
    }
    
    return false;
  });

  const categories = [...new Set(budgets.map(b => b.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30">
            <Bell className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Spending Alerts</h2>
            <p className="text-sm text-muted-foreground">Get notified about your spending patterns</p>
          </div>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10">
            <DialogHeader>
              <DialogTitle>Create Spending Alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Alert Type</label>
                <Select
                  value={newAlert.alert_type}
                  onValueChange={(v: 'budget_limit' | 'unusual_spending' | 'large_transaction') => 
                    setNewAlert({ ...newAlert, alert_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget_limit">Budget Limit Warning</SelectItem>
                    <SelectItem value="unusual_spending">Unusual Spending Pattern</SelectItem>
                    <SelectItem value="large_transaction">Large Transaction Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newAlert.alert_type === 'budget_limit' && (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Category</label>
                    <Select
                      value={newAlert.category}
                      onValueChange={(v) => setNewAlert({ ...newAlert, category: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Threshold ({newAlert.threshold_percentage}%)
                    </label>
                    <Input
                      type="range"
                      min={50}
                      max={100}
                      value={newAlert.threshold_percentage}
                      onChange={(e) => setNewAlert({ ...newAlert, threshold_percentage: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </>
              )}

              {newAlert.alert_type === 'large_transaction' && (
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Amount Threshold</label>
                  <Input
                    type="number"
                    value={newAlert.threshold_amount}
                    onChange={(e) => setNewAlert({ ...newAlert, threshold_amount: Number(e.target.value) })}
                    placeholder="500"
                  />
                </div>
              )}

              <Button 
                onClick={() => createAlert.mutate(newAlert)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600"
                disabled={createAlert.isPending}
              >
                Create Alert
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Triggered Alerts Banner */}
      <AnimatePresence>
        {triggeredAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Zap className="w-6 h-6 text-red-400" />
                </motion.div>
                <div>
                  <p className="font-medium text-red-300">
                    {triggeredAlerts.length} Alert{triggeredAlerts.length > 1 ? 's' : ''} Triggered
                  </p>
                  <p className="text-sm text-red-400/70">
                    Review your spending patterns below
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse bg-white/5">
              <div className="h-20" />
            </Card>
          ))
        ) : alerts.length === 0 ? (
          <Card className="p-8 col-span-full text-center bg-white/5 border-dashed border-white/10">
            <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No alerts configured yet</p>
            <p className="text-sm text-muted-foreground/70">Create your first alert to get started</p>
          </Card>
        ) : (
          alerts.map((alert, index) => {
            const config = alertTypeConfig[alert.alert_type];
            const Icon = config.icon;
            const isTriggered = triggeredAlerts.includes(alert);

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-4 bg-white/5 border-white/10 relative overflow-hidden ${
                  isTriggered ? 'ring-2 ring-red-500/50' : ''
                }`}>
                  {/* Gradient accent */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-5`} />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${config.color}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={alert.is_active}
                          onCheckedChange={(checked) => toggleAlert.mutate({ id: alert.id, is_active: checked })}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-red-400"
                          onClick={() => deleteAlert.mutate(alert.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="font-medium text-foreground mb-1">{config.label}</h3>
                    
                    {alert.alert_type === 'budget_limit' && (
                      <p className="text-sm text-muted-foreground">
                        {alert.category} at {alert.threshold_percentage}%
                      </p>
                    )}
                    
                    {alert.alert_type === 'large_transaction' && (
                      <p className="text-sm text-muted-foreground">
                        Over ${alert.threshold_amount?.toLocaleString()}
                      </p>
                    )}
                    
                    {alert.alert_type === 'unusual_spending' && (
                      <p className="text-sm text-muted-foreground">
                        AI-detected anomalies
                      </p>
                    )}

                    {isTriggered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 flex items-center gap-2 text-red-400 text-sm"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>Alert triggered!</span>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
