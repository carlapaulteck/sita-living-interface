import { useState, useEffect, useMemo } from "react";
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
  Leaf,
  Eye,
  Waves,
  Sun,
  CloudRain,
  Zap
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
  category: "breathwork" | "movement" | "rest" | "sensory" | "cognitive" | "grounding";
  intensity: "gentle" | "moderate";
  forStates: ("overload" | "fatigued" | "distracted" | "hyperfocus" | "neutral")[];
  guidedInstructions?: string[];
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
    forStates: ["overload", "fatigued", "distracted"],
    guidedInstructions: [
      "Breathe in slowly for 4 seconds",
      "Hold your breath for 4 seconds",
      "Breathe out slowly for 4 seconds",
      "Hold empty for 4 seconds",
      "Repeat this cycle gently"
    ]
  },
  {
    id: "body-scan",
    name: "Quick Body Scan",
    description: "Notice tension and release it",
    duration: 3,
    icon: Heart,
    category: "rest",
    intensity: "gentle",
    forStates: ["overload", "fatigued"],
    guidedInstructions: [
      "Close your eyes and take a slow breath",
      "Notice any tension in your forehead and jaw",
      "Let your shoulders drop",
      "Relax your hands",
      "Feel the ground beneath your feet"
    ]
  },
  {
    id: "5-4-3-2-1",
    name: "5-4-3-2-1 Grounding",
    description: "Anchor to the present moment",
    duration: 2,
    icon: Eye,
    category: "grounding",
    intensity: "gentle",
    forStates: ["overload", "distracted"],
    guidedInstructions: [
      "Notice 5 things you can see",
      "Notice 4 things you can touch",
      "Notice 3 things you can hear",
      "Notice 2 things you can smell",
      "Notice 1 thing you can taste"
    ]
  },
  {
    id: "nature-sounds",
    name: "Nature Sounds",
    description: "2 minutes of calming soundscape",
    duration: 2,
    icon: Leaf,
    category: "sensory",
    intensity: "gentle",
    forStates: ["overload", "fatigued", "neutral"],
  },
  {
    id: "gentle-stretch",
    name: "Desk Stretch",
    description: "Simple stretches for neck and shoulders",
    duration: 3,
    icon: Sparkles,
    category: "movement",
    intensity: "gentle",
    forStates: ["fatigued", "hyperfocus", "neutral"],
    guidedInstructions: [
      "Roll your shoulders back slowly",
      "Tilt your head to the left, hold 10 seconds",
      "Tilt your head to the right, hold 10 seconds",
      "Interlace your fingers and stretch arms forward",
      "Stand and shake out your body"
    ]
  },
  {
    id: "focus-reset",
    name: "Focus Reset",
    description: "Look away, blink, refocus exercise",
    duration: 1,
    icon: Brain,
    category: "cognitive",
    intensity: "gentle",
    forStates: ["hyperfocus", "fatigued"],
    guidedInstructions: [
      "Look at something 20 feet away",
      "Blink slowly 10 times",
      "Close your eyes for 5 seconds",
      "Open and refocus gently"
    ]
  },
  {
    id: "hydration-break",
    name: "Hydration Break",
    description: "Get water, stretch legs briefly",
    duration: 2,
    icon: Coffee,
    category: "movement",
    intensity: "gentle",
    forStates: ["fatigued", "hyperfocus", "neutral"],
  },
  {
    id: "ocean-waves",
    name: "Wave Breathing",
    description: "Sync breath with imagined ocean waves",
    duration: 3,
    icon: Waves,
    category: "breathwork",
    intensity: "gentle",
    forStates: ["overload", "distracted"],
    guidedInstructions: [
      "Imagine a calm ocean",
      "Breathe in as a wave approaches",
      "Breathe out as the wave retreats",
      "Let the rhythm become natural",
      "Feel tension wash away with each wave"
    ]
  },
  {
    id: "sunlight-break",
    name: "Light Exposure",
    description: "Step into natural light briefly",
    duration: 2,
    icon: Sun,
    category: "sensory",
    intensity: "moderate",
    forStates: ["fatigued", "neutral"],
  },
  {
    id: "rain-meditation",
    name: "Rain Visualization",
    description: "Imagine stress washing away",
    duration: 2,
    icon: CloudRain,
    category: "rest",
    intensity: "gentle",
    forStates: ["overload"],
    guidedInstructions: [
      "Close your eyes",
      "Imagine a gentle, warm rain",
      "Feel it washing away tension",
      "Each droplet carries away one worry",
      "Feel cleansed and calm"
    ]
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
  const [currentInstruction, setCurrentInstruction] = useState(0);
  
  // Get current moment state for personalization
  const currentState = adaptation?.momentState || "neutral";
  
  // Get recommended activities based on cognitive state - personalized
  const recommendedActivities = useMemo(() => {
    return RECOVERY_ACTIVITIES.filter(activity => {
      return activity.forStates.includes(currentState as any);
    }).slice(0, 4);
  }, [currentState]);
  
  // Get all activities sorted by relevance
  const sortedActivities = useMemo(() => {
    return [...RECOVERY_ACTIVITIES].sort((a, b) => {
      const aRelevant = a.forStates.includes(currentState as any) ? 0 : 1;
      const bRelevant = b.forStates.includes(currentState as any) ? 0 : 1;
      return aRelevant - bRelevant;
    });
  }, [currentState]);
  
  const startActivity = (activity: RecoveryActivity) => {
    setSelectedActivity(activity);
    setTimeRemaining(activity.duration * 60);
    setCurrentInstruction(0);
    setIsRunning(true);
    
    if (audioEnabled) {
      const intro = `Starting ${activity.name}. ${activity.description}`;
      speak(intro);
      
      // If there are guided instructions, start them after intro
      if (activity.guidedInstructions && activity.guidedInstructions.length > 0) {
        setTimeout(() => {
          if (audioEnabled) {
            speak(activity.guidedInstructions![0]);
          }
        }, 3000);
      }
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
    setCurrentInstruction(0);
  };
  
  // Progress through guided instructions
  useEffect(() => {
    if (isRunning && selectedActivity?.guidedInstructions) {
      const instructions = selectedActivity.guidedInstructions;
      const totalTime = selectedActivity.duration * 60;
      const intervalTime = (totalTime / instructions.length) * 1000;
      
      const timer = setInterval(() => {
        setCurrentInstruction(prev => {
          const next = prev + 1;
          if (next < instructions.length && audioEnabled) {
            speak(instructions[next]);
          }
          return next;
        });
      }, intervalTime);
      
      return () => clearInterval(timer);
    }
  }, [isRunning, selectedActivity, audioEnabled]);
  
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
  
  const getStateMessage = () => {
    switch (currentState) {
      case "overload":
        return "I noticed you're feeling overwhelmed. These activities are specifically chosen to help you decompress.";
      case "fatigued":
        return "Energy is running low. These activities can help restore your vitality.";
      case "hyperfocus":
        return "Time for a healthy break from deep focus. These will help you reset.";
      case "distracted":
        return "Let's help you find your center again with these grounding activities.";
      default:
        return autoActivated 
          ? "I noticed you might need a moment. Here are some gentle options." 
          : "Take a mindful pause to recharge.";
    }
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
          className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-medium text-foreground flex items-center gap-2">
                <Moon className="h-6 w-6 text-primary" />
                Recovery Mode
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {getStateMessage()}
              </p>
              {currentState !== "neutral" && (
                <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-xs text-primary">
                  <Zap className="h-3 w-3" />
                  Personalized for: {currentState}
                </div>
              )}
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
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedActivity.description}
                </p>
                
                {/* Guided Instructions */}
                {selectedActivity.guidedInstructions && (
                  <div className="mb-6 text-left p-4 rounded-lg bg-foreground/5">
                    <p className="text-xs text-muted-foreground mb-2">Current step:</p>
                    <p className="text-sm text-foreground font-medium">
                      {selectedActivity.guidedInstructions[Math.min(currentInstruction, selectedActivity.guidedInstructions.length - 1)]}
                    </p>
                    <div className="flex gap-1 mt-3">
                      {selectedActivity.guidedInstructions.map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i <= currentInstruction ? "bg-primary" : "bg-foreground/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
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
                  {sortedActivities.map(activity => {
                    const isRelevant = activity.forStates.includes(currentState as any);
                    return (
                      <button
                        key={activity.id}
                        onClick={() => startActivity(activity)}
                        className={`w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all ${
                          completedActivities.includes(activity.id)
                            ? "bg-primary/10"
                            : isRelevant 
                              ? "bg-foreground/5 hover:bg-foreground/10" 
                              : "bg-foreground/3 hover:bg-foreground/5 opacity-70"
                        }`}
                      >
                        <activity.icon className={`h-4 w-4 shrink-0 ${isRelevant ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-foreground">{activity.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {activity.duration} min
                          </span>
                          {activity.guidedInstructions && (
                            <span className="text-xs text-primary ml-2">• Guided</span>
                          )}
                        </div>
                        {completedActivities.includes(activity.id) && (
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </button>
                    );
                  })}
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
