import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const OnboardingFunnelChart = () => {
  // Fetch onboarding funnel data
  const { data: funnelData, isLoading } = useQuery({
    queryKey: ['admin-onboarding-funnel'],
    queryFn: async () => {
      // Get all user preferences to analyze onboarding progress
      const { data, error } = await supabase
        .from('user_preferences')
        .select('setup_mode, completed_at, primary_intents, autonomy_level, assistant_style, voice_profile, created_at');

      if (error) throw error;

      const users = data || [];
      const total = users.length;

      if (total === 0) {
        return {
          steps: [],
          completionRate: 0,
          averageDropOff: 'N/A',
        };
      }

      // Analyze each step completion
      const steps = [
        {
          name: 'Started',
          count: total,
          percentage: 100,
          color: 'hsl(var(--primary))',
        },
        {
          name: 'Setup Mode',
          count: users.filter(u => u.setup_mode).length,
          percentage: Math.round((users.filter(u => u.setup_mode).length / total) * 100),
          color: 'hsl(200, 80%, 60%)',
        },
        {
          name: 'Goals Set',
          count: users.filter(u => u.primary_intents && (u.primary_intents as string[]).length > 0).length,
          percentage: Math.round((users.filter(u => u.primary_intents && (u.primary_intents as string[]).length > 0).length / total) * 100),
          color: 'hsl(180, 70%, 50%)',
        },
        {
          name: 'Style Chosen',
          count: users.filter(u => u.assistant_style).length,
          percentage: Math.round((users.filter(u => u.assistant_style).length / total) * 100),
          color: 'hsl(160, 60%, 50%)',
        },
        {
          name: 'Voice Config',
          count: users.filter(u => u.voice_profile && Object.keys(u.voice_profile as object).length > 0).length,
          percentage: Math.round((users.filter(u => u.voice_profile && Object.keys(u.voice_profile as object).length > 0).length / total) * 100),
          color: 'hsl(140, 50%, 50%)',
        },
        {
          name: 'Completed',
          count: users.filter(u => u.completed_at).length,
          percentage: Math.round((users.filter(u => u.completed_at).length / total) * 100),
          color: 'hsl(120, 60%, 50%)',
        },
      ];

      // Calculate biggest drop-off
      let biggestDropOff = '';
      let biggestDropOffValue = 0;
      for (let i = 1; i < steps.length; i++) {
        const dropOff = steps[i - 1].percentage - steps[i].percentage;
        if (dropOff > biggestDropOffValue) {
          biggestDropOffValue = dropOff;
          biggestDropOff = `${steps[i - 1].name} → ${steps[i].name} (${dropOff}%)`;
        }
      }

      return {
        steps,
        completionRate: steps[steps.length - 1].percentage,
        averageDropOff: biggestDropOff || 'No significant drop-off',
      };
    },
  });

  return (
    <Card className="bg-[#151515] border-white/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="w-5 h-5 text-primary" />
          Onboarding Funnel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-white/5 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Completion Rate</span>
                </div>
                <p className="text-2xl font-bold text-emerald-400">
                  {funnelData?.completionRate || 0}%
                </p>
              </div>
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 text-red-400 mb-1">
                  <XCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Biggest Drop-off</span>
                </div>
                <p className="text-sm text-red-400 font-medium truncate">
                  {funnelData?.averageDropOff || 'N/A'}
                </p>
              </div>
            </div>

            {/* Funnel Chart */}
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData?.steps || []} layout="vertical">
                  <XAxis
                    type="number"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string, props: { payload: { count: number } }) => [
                      `${value}% (${props.payload.count} users)`,
                      'Reached',
                    ]}
                  />
                  <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                    {(funnelData?.steps || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Step-by-Step Progress */}
            <div className="space-y-3">
              {funnelData?.steps.map((step, index) => (
                <div key={step.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{step.name}</span>
                    <span className="text-foreground font-medium">
                      {step.count} ({step.percentage}%)
                    </span>
                  </div>
                  <Progress value={step.percentage} className="h-1.5" />
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OnboardingFunnelChart;
