import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, Heart, Activity, Brain, Droplets, 
  Wind, Timer, TrendingUp, Sparkles, Play
} from 'lucide-react';
import { BioCard, BioHeroCard } from './BioCard';
import { BioMetricRing } from './BioMetricRing';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { demoDailyStats } from '@/lib/bioOSData';
import { cn } from '@/lib/utils';

const recoveryMetrics = [
  { label: 'Sleep Score', value: 88, icon: Moon, color: 'purple', trend: '+5%' },
  { label: 'HRV', value: 62, unit: 'ms', icon: Heart, color: 'red', trend: '+8%' },
  { label: 'Resting HR', value: 52, unit: 'bpm', icon: Activity, color: 'cyan', trend: '-3' },
  { label: 'Stress Level', value: 28, icon: Brain, color: 'amber', trend: '-12%' }
];

const bodySections = [
  { id: 'shoulders', label: 'Shoulders', soreness: 2, x: 50, y: 15 },
  { id: 'chest', label: 'Chest', soreness: 3, x: 50, y: 28 },
  { id: 'back', label: 'Upper Back', soreness: 4, x: 50, y: 35 },
  { id: 'arms', label: 'Arms', soreness: 2, x: 25, y: 35 },
  { id: 'core', label: 'Core', soreness: 1, x: 50, y: 48 },
  { id: 'quads', label: 'Quads', soreness: 5, x: 40, y: 65 },
  { id: 'hamstrings', label: 'Hamstrings', soreness: 4, x: 60, y: 68 },
  { id: 'calves', label: 'Calves', soreness: 2, x: 50, y: 85 }
];

const recoveryProtocols = [
  { 
    id: 'breathing',
    name: 'Box Breathing',
    duration: '5 min',
    icon: Wind,
    color: 'from-cyan-500 to-blue-600',
    description: 'Calm your nervous system'
  },
  {
    id: 'stretching',
    name: 'Dynamic Stretching',
    duration: '10 min',
    icon: Activity,
    color: 'from-purple-500 to-pink-600',
    description: 'Full body mobility routine'
  },
  {
    id: 'meditation',
    name: 'Recovery Meditation',
    duration: '15 min',
    icon: Brain,
    color: 'from-emerald-500 to-green-600',
    description: 'Deep relaxation session'
  }
];

function getSorenessColor(level: number): string {
  if (level <= 2) return 'bg-emerald-500';
  if (level <= 3) return 'bg-amber-500';
  return 'bg-red-500';
}

export function RecoveryLab() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');

  const stats = demoDailyStats;

  return (
    <div className="space-y-6">
      {/* Recovery Score Hero */}
      <BioHeroCard mode="RECOVER" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Recovery Lab</h2>
            <p className="text-muted-foreground">Monitor and optimize your recovery</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/20">
              Sleep Analysis
            </Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Recommendations
            </Button>
          </div>
        </div>

        {/* Main Recovery Ring */}
        <div className="flex items-center gap-8">
          <BioMetricRing
            value={stats.recoveryScore}
            color="cyan"
            label="Recovery Score"
            sublabel="Ready to train"
            size="xl"
            showPulse
            icon={<Moon className="w-6 h-6" />}
          />

          {/* Metric Cards */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {recoveryMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BioCard className="p-4" hover>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-bold text-foreground">{metric.value}</span>
                          {metric.unit && (
                            <span className="text-sm text-muted-foreground">{metric.unit}</span>
                          )}
                        </div>
                      </div>
                      <div className={cn(
                        'p-2 rounded-lg',
                        `bg-${metric.color}-500/20`
                      )}>
                        <Icon className={cn('w-5 h-5', `text-${metric.color}-400`)} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm text-emerald-400">
                      <TrendingUp className="w-3 h-3" />
                      {metric.trend}
                    </div>
                  </BioCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </BioHeroCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Body Heat Map */}
        <BioCard className="p-6" gradient="from-purple-500/10 to-pink-600/10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Muscle Soreness Map</h3>
          
          <div className="relative aspect-[3/4] max-h-[400px] mx-auto">
            {/* Body silhouette */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 100 150"
                className="w-full h-full max-w-[200px]"
                fill="none"
              >
                {/* Head */}
                <circle cx="50" cy="12" r="10" fill="currentColor" className="text-white/20" />
                {/* Torso */}
                <path
                  d="M35 25 L65 25 L70 75 L30 75 Z"
                  fill="currentColor"
                  className="text-white/20"
                />
                {/* Arms */}
                <path
                  d="M35 28 L20 45 L15 75 L25 75 L30 50 L35 35"
                  fill="currentColor"
                  className="text-white/20"
                />
                <path
                  d="M65 28 L80 45 L85 75 L75 75 L70 50 L65 35"
                  fill="currentColor"
                  className="text-white/20"
                />
                {/* Legs */}
                <path
                  d="M35 75 L30 120 L25 145 L40 145 L45 120 L50 85"
                  fill="currentColor"
                  className="text-white/20"
                />
                <path
                  d="M65 75 L70 120 L75 145 L60 145 L55 120 L50 85"
                  fill="currentColor"
                  className="text-white/20"
                />
              </svg>
            </div>

            {/* Soreness indicators */}
            {bodySections.map((section) => (
              <motion.button
                key={section.id}
                className={cn(
                  'absolute w-6 h-6 rounded-full transform -translate-x-1/2 -translate-y-1/2',
                  'border-2 border-white/30',
                  getSorenessColor(section.soreness),
                  selectedSection === section.id && 'ring-2 ring-white ring-offset-2 ring-offset-background'
                )}
                style={{ left: `${section.x}%`, top: `${section.y}%` }}
                whileHover={{ scale: 1.2 }}
                onClick={() => setSelectedSection(section.id)}
              >
                <span className="sr-only">{section.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-muted-foreground">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-muted-foreground">High</span>
            </div>
          </div>

          {selectedSection && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-lg bg-white/5"
            >
              <p className="font-medium text-foreground">
                {bodySections.find(s => s.id === selectedSection)?.label}
              </p>
              <p className="text-sm text-muted-foreground">
                Soreness level: {bodySections.find(s => s.id === selectedSection)?.soreness}/5
              </p>
              <p className="text-sm text-cyan-400 mt-2">
                Recommended: Light stretching and foam rolling
              </p>
            </motion.div>
          )}
        </BioCard>

        {/* Recovery Protocols */}
        <div className="space-y-6">
          {/* Breathing Exercise */}
          <BioCard className="p-6" gradient="from-cyan-500/10 to-blue-600/10">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Quick Recovery: Box Breathing
            </h3>

            <div className="flex items-center justify-center py-8">
              <motion.div
                className={cn(
                  'w-32 h-32 rounded-2xl flex items-center justify-center',
                  'bg-gradient-to-br from-cyan-500/30 to-blue-600/30',
                  'border border-cyan-500/50'
                )}
                animate={isBreathing ? {
                  scale: breathPhase === 'inhale' ? [1, 1.3] :
                         breathPhase === 'hold' ? 1.3 :
                         breathPhase === 'exhale' ? [1.3, 1] : 1,
                } : {}}
                transition={{ duration: 4, ease: 'easeInOut' }}
              >
                <div className="text-center">
                  <Wind className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-sm text-cyan-400 capitalize">
                    {isBreathing ? breathPhase : 'Ready'}
                  </p>
                </div>
              </motion.div>
            </div>

            <Button
              onClick={() => setIsBreathing(!isBreathing)}
              className={cn(
                'w-full',
                isBreathing
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600'
              )}
            >
              {isBreathing ? 'Stop' : 'Start Breathing Exercise'}
            </Button>
          </BioCard>

          {/* Protocol Cards */}
          <div className="space-y-3">
            {recoveryProtocols.map((protocol, index) => {
              const Icon = protocol.icon;
              return (
                <motion.div
                  key={protocol.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BioCard className="p-4" gradient={protocol.color} hover>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'p-3 rounded-xl bg-gradient-to-br',
                        protocol.color
                      )}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{protocol.name}</h4>
                        <p className="text-sm text-muted-foreground">{protocol.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{protocol.duration}</p>
                        <Button size="sm" variant="ghost" className="mt-1">
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </BioCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sleep Optimization */}
      <BioCard className="p-6" gradient="from-purple-500/10 to-indigo-600/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Sleep Optimization</h3>
          <Button variant="outline" className="border-white/20">
            <Timer className="w-4 h-4 mr-2" />
            Set Sleep Schedule
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-white/5 text-center">
            <p className="text-sm text-muted-foreground">Bedtime</p>
            <p className="text-2xl font-bold text-purple-400">10:30 PM</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 text-center">
            <p className="text-sm text-muted-foreground">Wake Time</p>
            <p className="text-2xl font-bold text-cyan-400">6:00 AM</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 text-center">
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="text-2xl font-bold text-foreground">7.5h</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 text-center">
            <p className="text-sm text-muted-foreground">Cycles</p>
            <p className="text-2xl font-bold text-emerald-400">5</p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-sm text-emerald-400">
            💡 <strong>AI Tip:</strong> Based on your HRV data, consider going to bed 30 minutes earlier tonight for optimal recovery.
          </p>
        </div>
      </BioCard>
    </div>
  );
}
