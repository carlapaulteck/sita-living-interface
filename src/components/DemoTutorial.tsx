import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Shield,
  User,
  Brain,
  Calendar,
  BarChart3,
  Heart,
  Sparkles,
  Settings,
  Bell,
  Zap,
  Target,
  Users,
  Database,
  Activity,
} from "lucide-react";

interface TutorialStep {
  title: string;
  description: string;
  icon: any;
  color: string;
  highlight?: string;
}

const adminSteps: TutorialStep[] = [
  {
    title: "Welcome to Admin Dashboard",
    description: "As an admin, you have full control over the SITA platform. This dashboard gives you an overview of all users, system health, and platform activity.",
    icon: Shield,
    color: "text-amber-400",
    highlight: "Admin Dashboard",
  },
  {
    title: "User Management",
    description: "View and manage all registered users. You can assign roles (Admin, Moderator, User), search for specific users, and monitor their activity.",
    icon: Users,
    color: "text-blue-400",
    highlight: "User Management",
  },
  {
    title: "System Health Monitoring",
    description: "Monitor the health of database, authentication, and realtime services. Quick access to analytics and system diagnostics.",
    icon: Database,
    color: "text-green-400",
    highlight: "System Health",
  },
  {
    title: "Activity Feed",
    description: "Track all platform activity in real-time. See user signups, cognitive state changes, and system events as they happen.",
    icon: Activity,
    color: "text-purple-400",
    highlight: "Recent Activity",
  },
  {
    title: "Client Subscriptions",
    description: "View and manage client subscriptions, track revenue metrics, and monitor engagement across the platform.",
    icon: BarChart3,
    color: "text-cyan-400",
    highlight: "Subscriptions",
  },
];

const clientSteps: TutorialStep[] = [
  {
    title: "Welcome to SITA",
    description: "SITA is your sovereign AI partner - designed to understand your cognitive patterns and help you thrive. Let's explore the key features.",
    icon: Sparkles,
    color: "text-primary",
  },
  {
    title: "Cognitive Budget",
    description: "Track your mental energy throughout the day. SITA learns your patterns and suggests optimal times for different activities.",
    icon: Brain,
    color: "text-secondary",
    highlight: "Energy",
  },
  {
    title: "Daily Schedule",
    description: "Sync your calendar and let SITA help you plan your day around your cognitive peaks. Smart scheduling for maximum productivity.",
    icon: Calendar,
    color: "text-cyan-400",
    highlight: "Calendar",
  },
  {
    title: "Habit Tracking",
    description: "Build sustainable habits with streak tracking and smart reminders. SITA adjusts reminder timing based on your cognitive state.",
    icon: Target,
    color: "text-purple-400",
    highlight: "Habits",
  },
  {
    title: "Recovery Mode",
    description: "When you're feeling overwhelmed, activate Recovery Mode. SITA will reduce interruptions and suggest calming activities.",
    icon: Heart,
    color: "text-pink-400",
    highlight: "Recovery",
  },
  {
    title: "Weekly Insights",
    description: "Review your patterns and progress weekly. SITA identifies trends and provides actionable recommendations.",
    icon: BarChart3,
    color: "text-amber-400",
    highlight: "Insights",
  },
];

interface DemoTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoTutorial({ isOpen, onClose }: DemoTutorialProps) {
  const { demoMode } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = demoMode === "admin" ? adminSteps : clientSteps;
  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  const step = steps[currentStep];
  const StepIcon = step.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg"
        >
          <GlassCard className="p-6 relative overflow-hidden">
            {/* Background glow */}
            <div className={`absolute top-0 right-0 w-48 h-48 ${step.color.replace('text-', 'bg-')}/10 rounded-full blur-3xl`} />
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>

            {/* Content */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative z-10"
            >
              <div className={`w-16 h-16 rounded-2xl ${step.color.replace('text-', 'bg-')}/20 flex items-center justify-center mx-auto mb-6`}>
                <StepIcon className={`h-8 w-8 ${step.color}`} />
              </div>

              <h2 className="text-xl font-display font-semibold text-foreground text-center mb-3">
                {step.title}
              </h2>
              
              <p className="text-sm text-muted-foreground text-center leading-relaxed mb-6">
                {step.description}
              </p>

              {step.highlight && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center mb-6">
                  <p className="text-xs text-primary">
                    💡 Look for the <strong>"{step.highlight}"</strong> section in the dashboard
                  </p>
                </div>
              )}
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              <Button variant="link" onClick={handleSkip} className="text-muted-foreground">
                Skip Tutorial
              </Button>

              <Button onClick={handleNext} className="gap-1">
                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? "w-6 bg-primary"
                      : index < currentStep
                      ? "bg-primary/50"
                      : "bg-foreground/20"
                  }`}
                />
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
