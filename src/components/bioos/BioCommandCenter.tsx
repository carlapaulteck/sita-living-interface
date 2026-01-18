import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Moon, Target, Brain, ChevronRight, 
  Utensils, Dumbbell, Activity, FileText, Sparkles
} from 'lucide-react';
import { BioHeroCard, BioCard } from './BioCard';
import { BioMetricRing } from './BioMetricRing';
import { Button } from '@/components/ui/button';
import { demoDailyStats, bioModeConfig, BioMode, demoCoachMessages } from '@/lib/bioOSData';
import { cn } from '@/lib/utils';

const quickActions = [
  { icon: Utensils, label: 'Plan Meals', color: 'from-emerald-500 to-green-600' },
  { icon: Dumbbell, label: 'Start Workout', color: 'from-amber-500 to-orange-600' },
  { icon: Activity, label: 'Log Symptoms', color: 'from-purple-500 to-pink-600' },
  { icon: FileText, label: 'Export to Doctor', color: 'from-cyan-500 to-blue-600' }
];

export function BioCommandCenter() {
  const [currentMode, setCurrentMode] = useState<BioMode>('BUILD');
  const stats = demoDailyStats;
  const modeConfig = bioModeConfig[currentMode];

  return (
    <div className="space-y-6">
      {/* Mode Banner */}
      <BioHeroCard mode={currentMode} className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.div
              key={currentMode}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className={cn(
                'px-4 py-2 rounded-full text-white font-bold text-lg',
                'bg-gradient-to-r',
                modeConfig.gradient
              )}>
                {currentMode}
              </div>
              <span className="text-muted-foreground">{modeConfig.description}</span>
            </motion.div>
            <p className="text-2xl font-bold text-foreground mt-3">
              Good morning! Your body is ready for action.
            </p>
          </div>
          
          {/* Mode Selector */}
          <div className="flex gap-2">
            {(Object.keys(bioModeConfig) as BioMode[]).map((mode) => (
              <motion.button
                key={mode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentMode(mode)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  currentMode === mode
                    ? `bg-gradient-to-r ${bioModeConfig[mode].gradient} text-white`
                    : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                )}
              >
                {mode}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Metric Rings */}
        <div className="grid grid-cols-4 gap-6">
          <BioMetricRing
            value={stats.recoveryScore}
            color="cyan"
            label="Recovery"
            sublabel="%"
            showPulse={stats.recoveryScore > 80}
            icon={<Moon className="w-5 h-5" />}
          />
          <BioMetricRing
            value={stats.fuelStatus}
            color="emerald"
            label="Fuel"
            sublabel="%"
            icon={<Utensils className="w-5 h-5" />}
          />
          <BioMetricRing
            value={stats.trainingLoad}
            color="amber"
            label="Load"
            sublabel="%"
            icon={<Dumbbell className="w-5 h-5" />}
          />
          <BioMetricRing
            value={100 - stats.stressLevel}
            color="purple"
            label="Calm"
            sublabel="%"
            icon={<Brain className="w-5 h-5" />}
          />
        </div>
      </BioHeroCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BioCard
                hover
                className="p-4"
                gradient={action.color}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={cn(
                    'p-3 rounded-xl mb-3 bg-gradient-to-br',
                    action.color
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </div>
              </BioCard>
            </motion.div>
          );
        })}
      </div>

      {/* AI Briefing */}
      <BioCard className="p-6" gradient="from-cyan-500/20 to-blue-600/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">Today's Briefing</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your recovery score of <span className="text-cyan-400 font-medium">{stats.recoveryScore}%</span> indicates 
              you're well-rested and ready for high-intensity training. Sleep quality was excellent at{' '}
              <span className="text-cyan-400 font-medium">{stats.sleepScore}%</span>. 
              I recommend proceeding with today's Push Day workout. Your protein intake yesterday was optimal – 
              maintain the same meal plan today.
            </p>
            <div className="flex gap-2 mt-4">
              <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600">
                View Full Analysis
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <Button size="sm" variant="outline" className="border-white/20">
                Adjust Plan
              </Button>
            </div>
          </div>
        </div>
      </BioCard>

      {/* Coach Team Preview */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Coach Team Updates
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {demoCoachMessages.slice(0, 2).map((msg, index) => {
            const roleColors: Record<string, string> = {
              strength: 'from-amber-500 to-orange-600',
              nutrition: 'from-emerald-500 to-green-600',
              recovery: 'from-cyan-500 to-blue-600',
              safety: 'from-purple-500 to-pink-600'
            };
            const roleLabels: Record<string, string> = {
              strength: 'Strength Coach',
              nutrition: 'Nutrition Coach',
              recovery: 'Recovery Coach',
              safety: 'Safety Officer'
            };

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BioCard className="p-4" hover>
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold',
                      'bg-gradient-to-br',
                      roleColors[msg.role]
                    )}>
                      {msg.role[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {roleLabels[msg.role]}
                        </span>
                        <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                </BioCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
