import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, Play, Clock, Flame, TrendingUp, 
  ChevronRight, Check, AlertCircle, Zap, Calendar
} from 'lucide-react';
import { BioCard, BioHeroCard } from './BioCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { demoWorkouts, Workout, Exercise } from '@/lib/bioOSData';
import { cn } from '@/lib/utils';

const workoutTypeConfig: Record<string, { color: string; label: string }> = {
  strength: { color: 'from-amber-500 to-orange-600', label: 'Strength' },
  cardio: { color: 'from-cyan-500 to-blue-600', label: 'Cardio' },
  mobility: { color: 'from-purple-500 to-pink-600', label: 'Mobility' },
  hiit: { color: 'from-red-500 to-rose-600', label: 'HIIT' },
  recovery: { color: 'from-emerald-500 to-green-600', label: 'Recovery' }
};

const intensityConfig: Record<string, { color: string; label: string }> = {
  low: { color: 'text-emerald-400 bg-emerald-500/20', label: 'Low' },
  moderate: { color: 'text-blue-400 bg-blue-500/20', label: 'Moderate' },
  high: { color: 'text-amber-400 bg-amber-500/20', label: 'High' },
  max: { color: 'text-red-400 bg-red-500/20', label: 'Max Effort' }
};

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function TrainingHub() {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Weekly stats
  const completedWorkouts = demoWorkouts.filter(w => w.completed).length;
  const totalWorkouts = demoWorkouts.length;
  const weeklyVolume = 12500; // demo value
  const weeklyProgress = 78;

  const todayWorkout = demoWorkouts.find(w => w.scheduledFor === selectedDay);

  return (
    <div className="space-y-6">
      {/* Week Overview */}
      <BioHeroCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Training Hub</h2>
            <p className="text-muted-foreground">Week 4 of 8 • Strength Block</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/20">
              <Calendar className="w-4 h-4 mr-2" />
              Full Program
            </Button>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600">
              <Play className="w-4 h-4 mr-2" />
              Start Workout
            </Button>
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {fullDays.map((day, i) => {
            const workout = demoWorkouts.find(w => w.scheduledFor === day);
            const isToday = day === selectedDay;
            const config = workout ? workoutTypeConfig[workout.type] : null;

            return (
              <motion.button
                key={day}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  'p-3 rounded-xl text-center transition-all',
                  isToday
                    ? 'bg-gradient-to-br from-amber-500/30 to-orange-600/30 border-2 border-amber-500/50'
                    : 'bg-white/5 border border-white/10 hover:border-white/20'
                )}
              >
                <p className="text-xs text-muted-foreground mb-1">{days[i]}</p>
                {workout ? (
                  <div className={cn(
                    'w-8 h-8 mx-auto rounded-lg flex items-center justify-center',
                    'bg-gradient-to-br',
                    config?.color
                  )}>
                    <Dumbbell className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 mx-auto rounded-lg bg-white/10 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Rest</span>
                  </div>
                )}
                {workout?.completed && (
                  <Check className="w-4 h-4 mx-auto mt-1 text-emerald-400" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-foreground">
              {completedWorkouts}/{totalWorkouts}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-sm text-muted-foreground">Volume Load</p>
            <p className="text-2xl font-bold text-amber-400">
              {weeklyVolume.toLocaleString()} lbs
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-sm text-muted-foreground">Weekly Progress</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-emerald-400">{weeklyProgress}%</p>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-sm text-muted-foreground">Streak</p>
            <p className="text-2xl font-bold text-purple-400">12 days 🔥</p>
          </div>
        </div>
      </BioHeroCard>

      {/* Today's Workout */}
      {todayWorkout ? (
        <BioCard 
          className="p-6" 
          gradient={workoutTypeConfig[todayWorkout.type].color}
          onClick={() => setSelectedWorkout(todayWorkout)}
          hover
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  intensityConfig[todayWorkout.intensity].color
                )}>
                  {intensityConfig[todayWorkout.intensity].label}
                </span>
                <span className="text-sm text-muted-foreground">
                  {todayWorkout.exercises.length} exercises
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground">{todayWorkout.name}</h3>
              <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {todayWorkout.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  ~{todayWorkout.duration * 8} cal
                </span>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600">
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
          </div>

          {/* Exercise Preview */}
          <div className="space-y-2">
            {todayWorkout.exercises.slice(0, 3).map((ex, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                    {i + 1}
                  </span>
                  <span className="font-medium text-foreground">{ex.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {ex.sets} × {ex.reps}
                </span>
              </div>
            ))}
            {todayWorkout.exercises.length > 3 && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground p-2">
                <span>+{todayWorkout.exercises.length - 3} more exercises</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>
        </BioCard>
      ) : (
        <BioCard className="p-6 text-center" gradient="from-emerald-500/10 to-green-600/10">
          <div className="p-4 rounded-full bg-emerald-500/20 w-fit mx-auto mb-4">
            <Zap className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Rest Day</h3>
          <p className="text-muted-foreground mt-1">
            Focus on recovery, stretching, and light mobility work
          </p>
        </BioCard>
      )}

      {/* Upcoming Workouts */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">This Week</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {demoWorkouts.map((workout, index) => {
            const config = workoutTypeConfig[workout.type];
            const intensity = intensityConfig[workout.intensity];

            return (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BioCard
                  className="p-4"
                  gradient={config.color}
                  hover
                  onClick={() => setSelectedWorkout(workout)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn(
                      'p-2 rounded-lg bg-gradient-to-br',
                      config.color
                    )}>
                      <Dumbbell className="w-4 h-4 text-white" />
                    </div>
                    <span className={cn('px-2 py-0.5 rounded-full text-xs', intensity.color)}>
                      {intensity.label}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-foreground mb-1">{workout.name}</h4>
                  <p className="text-sm text-muted-foreground">{workout.scheduledFor}</p>
                  
                  <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {workout.duration}m
                    </span>
                    <span>{workout.exercises.length} exercises</span>
                  </div>
                </BioCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Workout Detail Modal */}
      <AnimatePresence>
        {selectedWorkout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedWorkout(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[80vh] overflow-auto"
            >
              <BioCard className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        'px-3 py-1 rounded-full text-sm',
                        intensityConfig[selectedWorkout.intensity].color
                      )}>
                        {intensityConfig[selectedWorkout.intensity].label}
                      </span>
                      <span className="text-muted-foreground">
                        {selectedWorkout.scheduledFor}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedWorkout.name}</h2>
                    <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedWorkout.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Dumbbell className="w-4 h-4" />
                        {selectedWorkout.exercises.length} exercises
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedWorkout(null)}>
                    ✕
                  </Button>
                </div>

                <div className="space-y-3">
                  {selectedWorkout.exercises.map((exercise, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">
                            {i + 1}
                          </span>
                          <h4 className="font-semibold text-foreground">{exercise.name}</h4>
                        </div>
                        {exercise.weight && (
                          <span className="text-amber-400 font-medium">{exercise.weight}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pl-11">
                        <span>{exercise.sets} sets</span>
                        <span>×</span>
                        <span>{exercise.reps} reps</span>
                        <span className="text-white/30">|</span>
                        <span>Rest: {exercise.rest}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600">
                    <Play className="w-4 h-4 mr-2" />
                    Start Workout
                  </Button>
                  <Button variant="outline" className="border-white/20">
                    Edit Workout
                  </Button>
                </div>
              </BioCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
