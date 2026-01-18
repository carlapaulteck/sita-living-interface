import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Wind, 
  Music2, 
  Coffee, 
  Moon, 
  Pause, 
  Timer,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  Brain,
  Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { useAdaptationSafe } from "@/contexts/AdaptationContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface RecoveryActivity {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  icon: typeof Heart;
  category: "breathwork" | "movement" | "rest" | "sensory" | "cognitive";
  intensity: "gentle" | "moderate";
}

const RECOVERY_ACTIVITIES: RecoveryActivity[] = [
  {
    id: "box-breathing",
    name: "Box Breathing",
    description: "4-4-4-4 pattern to reset your nervous system",
    duration: 2,
    icon: Wind,
    category: "breathwork",
    intensity: "gentle",
  },
  {
    id: "body-scan",
    name: "Quick Body Scan",
    description: "Notice tension and release it",
    duration: 3,
    icon: Heart,
    category: "rest",
    intensity: "gentle",
  },
  {
    id: "nature-sounds",
    name: "Nature Sounds",
    description: "2 minutes of calming soundscape",
    duration: 2,
    icon: Leaf,
    category: "sensory",
    intensity: "gentle",
  },
  {
    id: "gentle-stretch",
    name: "Desk Stretch",
    description: "Simple stretches for neck and shoulders",
    duration: 3,
    icon: Sparkles,
    category: "movement",
    intensity: "gentle",
  },
  {
    id: "focus-reset",
    name: "Focus Reset",
    description: "Look away, blink, refocus exercise",
    duration: 1,
    icon: Brain,
    category: "cognitive",
    intensity: "gentle",
  },
  {
    id: "hydration-break",
    name: "Hydration Break",
    description: "Get water, stretch legs briefly",
    duration: 2,
    icon: Coffee,
    category: "movement",
    intensity: "gentle",
  },
];

interface RecoveryModeProps {
  isOpen: boolean;
  onClose: () => void;
  autoActivated?: boolean;
}

export function RecoveryMode({ isOpen, onClose, autoActivated = false }: RecoveryModeProps) {
  const adaptation = useAdaptationSafe();
  const { speak, stop, isSpeaking } = useTextToSpeech();
  
  const [selectedActivity, setSelectedActivity] = useState<RecoveryActivity | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Get recommended activities based on cognitive state
  const recommendedActivities = RECOVERY_ACTIVITIES.filter(activity => {
    if (adaptation?.momentState === "overload") {
      return activity.category === "breathwork" || activity.category === "rest";
    }
    if (adaptation?.momentState === "fatigued") {
      return activity.category === "movement" || activity.category === "sensory";
    }
    return true;
  });
  
  const startActivity = (activity: RecoveryActivity) => {
    setSelectedActivity(activity);
    setTimeRemaining(activity.duration * 60);
    setIsRunning(true);
    
    if (audioEnabled) {
      speak(`Starting ${activity.name}. ${activity.description}`);
    }
  };
  
  const completeActivity = () => {
    if (selectedActivity) {
      setCompletedActivities(prev => [...prev, selectedActivity.id]);
      if (audioEnabled) {
        speak("Well done. Take a moment before continuing.");
      }
    }
    setIsRunning(false);
    setSelectedActivity(null);
    setTimeRemaining(0);
  };
  
  const cancelActivity = () => {
    stop();
    setIsRunning(false);
    setSelectedActivity(null);
    setTimeRemaining(0);
  };
  
  // Timer countdown
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeActivity();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning, timeRemaining]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-lg"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-medium text-foreground flex items-center gap-2">
                <Moon className="h-6 w-6 text-primary" />
                Recovery Mode
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {autoActivated 
                  ? "I noticed you might need a moment. Here are some gentle options." 
                  : "Take a mindful pause to recharge."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="h-8 w-8"
              >
                {audioEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Active Activity */}
          {isRunning && selectedActivity ? (
            <GlassCard className="p-8 text-center mb-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <selectedActivity.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">
                  {selectedActivity.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {selectedActivity.description}
                </p>
                
                {/* Timer Ring */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-foreground/10"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 56}
                      strokeDashoffset={2 * Math.PI * 56 * (1 - timeRemaining / (selectedActivity.duration * 60))}
                      strokeLinecap="round"
                      className="text-primary transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-mono text-foreground">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  onClick={cancelActivity}
                  className="gap-2"
                >
                  <Pause className="h-4 w-4" />
                  End Early
                </Button>
              </motion.div>
            </GlassCard>
          ) : (
            <>
              {/* Recommended Activities */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Recommended for you
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {recommendedActivities.slice(0, 4).map(activity => (
                    <motion.button
                      key={activity.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startActivity(activity)}
                      className={`p-4 rounded-xl text-left transition-all ${
                        completedActivities.includes(activity.id)
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-foreground/5 hover:bg-foreground/10"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <activity.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground truncate">
                              {activity.name}
                            </span>
                            {completedActivities.includes(activity.id) && (
                              <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {activity.duration} min
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* All Activities */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">
                  All recovery activities
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {RECOVERY_ACTIVITIES.map(activity => (
                    <button
                      key={activity.id}
                      onClick={() => startActivity(activity)}
                      className={`w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all ${
                        completedActivities.includes(activity.id)
                          ? "bg-primary/10"
                          : "bg-foreground/5 hover:bg-foreground/10"
                      }`}
                    >
                      <activity.icon className="h-4 w-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-foreground">{activity.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {activity.duration} min
                        </span>
                      </div>
                      {completedActivities.includes(activity.id) && (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {/* Footer */}
          {!isRunning && (
            <div className="mt-6 pt-4 border-t border-foreground/10 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {completedActivities.length > 0 
                  ? `${completedActivities.length} activities completed`
                  : "Choose an activity to begin"}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                Skip for now
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
