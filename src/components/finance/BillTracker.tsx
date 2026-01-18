import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt, Plus, Calendar, Check, Clock, AlertCircle, 
  Zap, Home, Wifi, Car, CreditCard, Heart, Smartphone,
  Trash2, Edit2, DollarSign
} from 'lucide-react';
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
import { format, differenceInDays, addMonths, addWeeks, addYears, addQuarters, isBefore, isToday } from 'date-fns';

interface Bill {
  id: string;
  name: string;
  amount: number;
  due_day: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  category: string | null;
  is_autopay: boolean;
  provider: string | null;
  next_due_date: string | null;
  is_active: boolean;
}

interface BillPayment {
  id: string;
  bill_id: string;
  amount_paid: number;
  paid_at: string;
  status: string;
}

const categoryIcons: Record<string, typeof Home> = {
  'Housing': Home,
  'Utilities': Zap,
  'Internet': Wifi,
  'Auto': Car,
  'Insurance': Heart,
  'Subscriptions': Smartphone,
  'Credit Card': CreditCard,
  'Other': Receipt
};

const categoryColors: Record<string, string> = {
  'Housing': 'from-blue-500 to-indigo-600',
  'Utilities': 'from-amber-500 to-orange-600',
  'Internet': 'from-cyan-500 to-blue-600',
  'Auto': 'from-emerald-500 to-green-600',
  'Insurance': 'from-pink-500 to-rose-600',
  'Subscriptions': 'from-purple-500 to-violet-600',
  'Credit Card': 'from-red-500 to-rose-600',
  'Other': 'from-gray-500 to-slate-600'
};

function getNextDueDate(dueDay: number, frequency: string): Date {
  const today = new Date();
  let nextDue = new Date(today.getFullYear(), today.getMonth(), dueDay);
  
  if (isBefore(nextDue, today) && !isToday(nextDue)) {
    switch (frequency) {
      case 'weekly':
        nextDue = addWeeks(nextDue, 1);
        break;
      case 'monthly':
        nextDue = addMonths(nextDue, 1);
        break;
      case 'quarterly':
        nextDue = addQuarters(nextDue, 1);
        break;
      case 'yearly':
        nextDue = addYears(nextDue, 1);
        break;
    }
  }
  
  return nextDue;
}

export function BillTracker() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newBill, setNewBill] = useState<{
    name: string;
    amount: number;
    due_day: number;
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    category: string;
    is_autopay: boolean;
    provider: string;
  }>({
    name: '',
    amount: 0,
    due_day: 1,
    frequency: 'monthly',
    category: 'Other',
    is_autopay: false,
    provider: ''
  });

  const { data: bills = [], isLoading } = useQuery({
    queryKey: ['bills', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('due_day', { ascending: true });
      if (error) throw error;
      return data as Bill[];
    },
    enabled: !!user?.id
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['bill-payments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('bill_payments')
        .select('*')
        .eq('user_id', user.id)
        .order('paid_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as BillPayment[];
    },
    enabled: !!user?.id
  });

  const createBill = useMutation({
    mutationFn: async (bill: typeof newBill) => {
      if (!user?.id) throw new Error('Not authenticated');
      const nextDue = getNextDueDate(bill.due_day, bill.frequency);
      const { error } = await supabase.from('bills').insert({
        user_id: user.id,
        ...bill,
        next_due_date: format(nextDue, 'yyyy-MM-dd')
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      setIsAddOpen(false);
      setNewBill({
        name: '',
        amount: 0,
        due_day: 1,
        frequency: 'monthly',
        category: 'Other',
        is_autopay: false,
        provider: ''
      });
      toast.success('Bill added successfully');
    }
  });

  const markPaid = useMutation({
    mutationFn: async (bill: Bill) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      // Create payment record
      const { error: paymentError } = await supabase.from('bill_payments').insert({
        bill_id: bill.id,
        user_id: user.id,
        amount_paid: bill.amount,
        status: 'completed'
      });
      if (paymentError) throw paymentError;

      // Update next due date
      const nextDue = getNextDueDate(bill.due_day, bill.frequency);
      const { error: updateError } = await supabase
        .from('bills')
        .update({ next_due_date: format(addMonths(nextDue, 1), 'yyyy-MM-dd') })
        .eq('id', bill.id);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      queryClient.invalidateQueries({ queryKey: ['bill-payments'] });
      toast.success('Bill marked as paid!');
    }
  });

  const deleteBill = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('bills').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      toast.success('Bill deleted');
    }
  });

  // Calculate stats
  const totalMonthly = bills.reduce((sum, bill) => {
    if (bill.frequency === 'monthly') return sum + bill.amount;
    if (bill.frequency === 'weekly') return sum + bill.amount * 4;
    if (bill.frequency === 'quarterly') return sum + bill.amount / 3;
    if (bill.frequency === 'yearly') return sum + bill.amount / 12;
    return sum;
  }, 0);

  const upcomingBills = bills
    .map(bill => ({
      ...bill,
      nextDue: getNextDueDate(bill.due_day, bill.frequency),
      daysUntil: differenceInDays(getNextDueDate(bill.due_day, bill.frequency), new Date())
    }))
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const overdueBills = upcomingBills.filter(b => b.daysUntil < 0);
  const dueSoonBills = upcomingBills.filter(b => b.daysUntil >= 0 && b.daysUntil <= 7);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30">
            <Receipt className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Bill Tracker</h2>
            <p className="text-sm text-muted-foreground">Never miss a payment again</p>
          </div>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Bill
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10">
            <DialogHeader>
              <DialogTitle>Add New Bill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Bill Name</label>
                  <Input
                    value={newBill.name}
                    onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
                    placeholder="Netflix, Rent, etc."
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Amount</label>
                  <Input
                    type="number"
                    value={newBill.amount}
                    onChange={(e) => setNewBill({ ...newBill, amount: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Due Day</label>
                  <Input
                    type="number"
                    min={1}
                    max={31}
                    value={newBill.due_day}
                    onChange={(e) => setNewBill({ ...newBill, due_day: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Frequency</label>
                  <Select
                    value={newBill.frequency}
                    onValueChange={(v: 'weekly' | 'monthly' | 'quarterly' | 'yearly') => 
                      setNewBill({ ...newBill, frequency: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Category</label>
                  <Select
                    value={newBill.category}
                    onValueChange={(v) => setNewBill({ ...newBill, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(categoryIcons).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Provider</label>
                  <Input
                    value={newBill.provider || ''}
                    onChange={(e) => setNewBill({ ...newBill, provider: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <p className="font-medium">Auto-Pay Enabled</p>
                  <p className="text-sm text-muted-foreground">Bill is automatically paid</p>
                </div>
                <Switch
                  checked={newBill.is_autopay}
                  onCheckedChange={(checked) => setNewBill({ ...newBill, is_autopay: checked })}
                />
              </div>

              <Button
                onClick={() => createBill.mutate(newBill)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600"
                disabled={createBill.isPending || !newBill.name || !newBill.amount}
              >
                Add Bill
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/20">
          <p className="text-sm text-muted-foreground">Monthly Total</p>
          <p className="text-2xl font-bold text-purple-400">${totalMonthly.toLocaleString()}</p>
        </Card>
        <Card className={`p-4 ${overdueBills.length > 0 ? 'bg-gradient-to-br from-red-500/10 to-rose-600/10 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
          <p className="text-sm text-muted-foreground">Overdue</p>
          <p className={`text-2xl font-bold ${overdueBills.length > 0 ? 'text-red-400' : 'text-foreground'}`}>
            {overdueBills.length}
          </p>
        </Card>
        <Card className={`p-4 ${dueSoonBills.length > 0 ? 'bg-gradient-to-br from-amber-500/10 to-orange-600/10 border-amber-500/20' : 'bg-white/5 border-white/10'}`}>
          <p className="text-sm text-muted-foreground">Due This Week</p>
          <p className={`text-2xl font-bold ${dueSoonBills.length > 0 ? 'text-amber-400' : 'text-foreground'}`}>
            {dueSoonBills.length}
          </p>
        </Card>
      </div>

      {/* Upcoming Bills Timeline */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          Upcoming Bills
        </h3>

        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse bg-white/5">
              <div className="h-16" />
            </Card>
          ))
        ) : upcomingBills.length === 0 ? (
          <Card className="p-8 text-center bg-white/5 border-dashed border-white/10">
            <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No bills tracked yet</p>
            <p className="text-sm text-muted-foreground/70">Add your first bill to get started</p>
          </Card>
        ) : (
          <AnimatePresence>
            {upcomingBills.map((bill, index) => {
              const Icon = categoryIcons[bill.category || 'Other'] || Receipt;
              const color = categoryColors[bill.category || 'Other'] || categoryColors['Other'];
              const isOverdue = bill.daysUntil < 0;
              const isDueSoon = bill.daysUntil >= 0 && bill.daysUntil <= 3;

              return (
                <motion.div
                  key={bill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`p-4 bg-white/5 border-white/10 ${
                    isOverdue ? 'ring-2 ring-red-500/50' : isDueSoon ? 'ring-2 ring-amber-500/30' : ''
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{bill.name}</h4>
                          {bill.is_autopay && (
                            <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Auto
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>${bill.amount.toLocaleString()}</span>
                          <span>•</span>
                          <span className={`flex items-center gap-1 ${
                            isOverdue ? 'text-red-400' : isDueSoon ? 'text-amber-400' : ''
                          }`}>
                            {isOverdue ? (
                              <>
                                <AlertCircle className="w-3 h-3" />
                                {Math.abs(bill.daysUntil)} days overdue
                              </>
                            ) : bill.daysUntil === 0 ? (
                              <>
                                <Clock className="w-3 h-3" />
                                Due today
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" />
                                {bill.daysUntil} days
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                          onClick={() => markPaid.mutate(bill)}
                          disabled={markPaid.isPending}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Paid
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-red-400"
                          onClick={() => deleteBill.mutate(bill.id)}
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

      {/* Recent Payments */}
      {payments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-muted-foreground" />
            Recent Payments
          </h3>
          <div className="space-y-2">
            {payments.slice(0, 5).map((payment) => {
              const bill = bills.find(b => b.id === payment.bill_id);
              return (
                <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-foreground">{bill?.name || 'Unknown'}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground">${payment.amount_paid.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(payment.paid_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
